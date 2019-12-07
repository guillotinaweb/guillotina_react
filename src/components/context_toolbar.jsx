import React from 'react';

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownContent} from 'bloomer'

import {Button} from 'bloomer'


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

export function ContextToolbar(props) {
  return (
    <>
      <div className="level-item">
        <form action="" className="form"
          onSubmit={(ev) => alert('submit')}>
            <input type="text" className="input"
              placeholder="Search" />
        </form>
      </div>
      <div className="level-item">
        <CreateButton {... props} />
      </div>
    </>
  )
}
