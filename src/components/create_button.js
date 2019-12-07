
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownContent} from 'bloomer'
import {Button, Icon} from 'bloomer'

import {useState, useEffect} from 'react'

export function CreateButton(props) {
  return (
    <Dropdown >
      <DropdownTrigger>
        <Button>
          <span class="icon">
            <i class="fas fa-plus"></i>
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownContent>
          <DropdownItem href="#">First item</DropdownItem>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
  )
}
