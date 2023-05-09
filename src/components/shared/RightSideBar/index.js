
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { HSeparator } from '../Separator'


export default function RightSideBar(props) {
  const { sidebarVariant, setSidebarVariant, isOpen, onClose, fixed, title, ...rest } = props

  const bgDrawer = 'brand.neutral5'
  const settingsRef = React.useRef()
  return (
    <>
      <Drawer
        closeOnOverlayClick={false}
        isOpen={props.isOpen}
        onClose={props.onClose}
        finalFocusRef={settingsRef}
        blockScrollOnMount={false}
        trapFocus={false}
        variant="permanent"
        size={"sm"}
      >
        <DrawerContent bg={bgDrawer}>
          <DrawerHeader pt="16px" px="24px">
            <DrawerCloseButton />
            <Text fontSize="xl" fontWeight="bold" my="12px">
              {title}
            </Text>

            <HSeparator />
          </DrawerHeader>
          <DrawerBody

            ps="24px" pe="40px">
            {props.children}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
