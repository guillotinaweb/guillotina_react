#!/usr/bin/env node

/**
 * Manual test data initialization script
 *
 * This script initializes Guillotina with test data for manual testing.
 * It replicates the setupGuillotina function from utils.js
 *
 * Usage:
 *   node init-test-data.js
 *   GUILLOTINA_URL=http://localhost:8080 node init-test-data.js
 *   node init-test-data.js --guillotina http://localhost:8080 --db db --container container_test
 */

const env = {
  guillotina:
    process.env.GUILLOTINA_URL ||
    process.env.GUILLOTINA ||
    'http://127.0.0.1:8080',
  db: process.env.GUILLOTINA_DB || 'db',
  container: process.env.GUILLOTINA_CONTAINER || 'container_test',
}

// Parse command line arguments
const args = process.argv.slice(2)
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--guillotina' && args[i + 1]) {
    env.guillotina = args[i + 1]
    i++
  } else if (args[i] === '--db' && args[i + 1]) {
    env.db = args[i + 1]
    i++
  } else if (args[i] === '--container' && args[i + 1]) {
    env.container = args[i + 1]
    i++
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Usage: node init-test-data.js [options]

Options:
  --guillotina <url>    Guillotina server URL (default: http://127.0.0.1:8080)
  --db <name>           Database name (default: db)
  --container <name>    Container name (default: container_test)
  --help, -h            Show this help message

Environment variables:
  GUILLOTINA_URL        Guillotina server URL
  GUILLOTINA_DB         Database name
  GUILLOTINA_CONTAINER  Container name

Examples:
  node init-test-data.js
  GUILLOTINA_URL=http://localhost:8080 node init-test-data.js
  node init-test-data.js --guillotina http://localhost:8080 --db mydb --container mycontainer
`)
    process.exit(0)
  }
}

const apiBase = `${env.guillotina}/${env.db}`
const containerApi = `${apiBase}/${env.container}`

// Base64 encoded "root:root" for Basic Auth
const authHeader = 'Basic cm9vdDpyb290'

const headers = {
  Authorization: authHeader,
  'Content-Type': 'application/json',
}

/**
 * Make an HTTP request and handle the response
 */
async function makeRequest(
  method,
  url,
  data = null,
  allowedStatuses = [200, 201]
) {
  const options = {
    method,
    headers,
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)
    const status = response.status

    if (allowedStatuses.includes(status)) {
      return { success: true, status, response }
    }

    const body = await response.text()
    return {
      success: false,
      status,
      error: `Unexpected status ${status}: ${body}`,
      response,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      response: null,
    }
  }
}

/**
 * Guard response - throw error if status not allowed
 */
async function guardResponse(
  method,
  url,
  data = null,
  allowedStatuses = [200, 201, 409]
) {
  const result = await makeRequest(method, url, data, allowedStatuses)

  if (!result.success) {
    throw new Error(
      result.error || `Request failed with status ${result.status}`
    )
  }

  return result
}

/**
 * Setup Guillotina with test data
 */
async function setupGuillotina() {
  console.log('🚀 Starting Guillotina test data initialization...\n')
  console.log(`Configuration:`)
  console.log(`  Guillotina: ${env.guillotina}`)
  console.log(`  Database: ${env.db}`)
  console.log(`  Container: ${env.container}\n`)

  try {
    // 0. Delete container if it exists (to ensure clean state)
    console.log('🗑️  Deleting existing container (if any)...')
    const deleteResult = await makeRequest(
      'DELETE',
      containerApi,
      null,
      [200, 204, 404]
    )
    if (deleteResult.success && deleteResult.status !== 404) {
      console.log('✅ Existing container deleted\n')
    } else {
      console.log('ℹ️  No existing container found\n')
    }

    // 1. Create container
    console.log('📦 Creating container...')
    await guardResponse('POST', apiBase, {
      '@type': 'Container',
      id: env.container,
    })
    console.log('✅ Container created\n')

    // 2. Install dbusers addon
    console.log('🔌 Installing dbusers addon...')
    await guardResponse('POST', `${containerApi}/@addons`, {
      id: 'dbusers',
    })
    console.log('✅ dbusers addon installed\n')

    // 3. Install image addon
    console.log('🔌 Installing image addon...')
    await guardResponse('POST', `${containerApi}/@addons`, {
      id: 'image',
    })
    console.log('✅ image addon installed\n')

    // 4. Create group
    console.log('👥 Creating group...')
    await guardResponse('POST', `${containerApi}/groups`, {
      '@type': 'Group',
      id: 'group_view_content',
      title: 'group_view_content',
    })
    console.log('✅ Group created\n')

    // 5. Create user
    console.log('👤 Creating user...')
    await guardResponse('POST', `${containerApi}/users`, {
      '@type': 'User',
      username: 'default',
      password: 'default',
      email: 'default@test.com',
      user_groups: ['group_view_content'],
    })
    console.log('✅ User created\n')

    // 6. Create folder
    console.log('📁 Creating folder...')
    await guardResponse('POST', containerApi, {
      '@type': 'Folder',
      id: 'gmi_folder',
      title: 'GMI Folder',
    })
    console.log('✅ Folder created\n')

    // 7. Create 50 GMI items
    console.log('📝 Creating 50 GMI items...')
    const choiceFields = [
      'date',
      'integer',
      'text',
      'float',
      'keyword',
      'boolean',
    ]

    for (let i = 0; i < 50; i++) {
      await guardResponse('POST', `${containerApi}/gmi_folder`, {
        '@type': 'GMI',
        title: `Test GMI item ${i}`,
        number_field: i,
        boolean_field: i % 2 === 0,
        choice_field_vocabulary: ['plone', 'guillotina'][i % 2],
        choice_field: choiceFields[i % 6],
      })

      if ((i + 1) % 10 === 0) {
        console.log(`  Created ${i + 1}/50 items...`)
      }
    }
    console.log('✅ All 50 GMI items created\n')

    console.log('✨ Test data initialization completed successfully!')
    console.log('\n📋 Summary:')
    console.log(`  - Container: ${env.container}`)
    console.log(`  - Addons: dbusers, image`)
    console.log(`  - Group: group_view_content`)
    console.log(`  - User: default (password: default)`)
    console.log(`  - Folder: gmi_folder`)
    console.log(`  - GMI Items: 50 items in gmi_folder`)
    console.log(`\n🔗 Access your container at: ${containerApi}`)
  } catch (error) {
    console.error('\n❌ Error during initialization:')
    console.error(error.message)
    process.exit(1)
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ Error: fetch is not available.')
  console.error(
    'This script requires Node.js 18+ or you need to install node-fetch.'
  )
  console.error('\nTo install node-fetch:')
  console.error('  npm install node-fetch')
  console.error('\nThen modify this script to import it:')
  console.error('  const fetch = require("node-fetch")')
  process.exit(1)
}

// Run the setup
setupGuillotina().catch((error) => {
  console.error('\n❌ Fatal error:')
  console.error(error)
  process.exit(1)
})
