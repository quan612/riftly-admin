import {
  Button,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
  Text,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'

import { Field } from 'formik'
import { useState } from 'react'

export const RequiredInput = ({
  label,
  type = 'text',
  fieldName,
  error,
  touched,
  placeholder = '',
  validate = null,
  onChange
}) => {
  return (
    <FormControl isRequired isInvalid={error && touched}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        {label}
      </FormLabel>
      <Field
        id={fieldName}
        autoComplete={'off'}
        name={fieldName}
        type={type}
        as={Input}
        fontSize="md"
        variant="riftly"
        ms="4px"
        placeholder={placeholder}
        validate={validate}
        onChange={onChange}
      />

      <FormErrorMessage fontSize="md" name={fieldName}>
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}


export const RequiredPasswordInput = ({
  label,
  fieldName,
  error,
  touched,
  placeholder = '',
  validate = null,
}) => {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)

  return (
    <FormControl isRequired isInvalid={error && touched}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        {label}
      </FormLabel>
      <InputGroup size="md">
        <Field
          id={fieldName}
          autoComplete={'off'}
          name={fieldName}
          type={show ? 'text' : 'password'}
          as={Input}
          fontSize="md"
          variant="riftly"
          ms="4px"
          placeholder={placeholder}
          validate={validate}
        />

        <InputRightElement width="4.5rem">
          <Text height="1.25rem" size="sm" onClick={handleClick} cursor="pointer">
            {show ? 'Hide' : 'Show'}
          </Text>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage fontSize="md" name={fieldName}>
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}

export const NonRequiredTextInput = ({
  label,
  type = 'text',
  fieldName,
  error = null,
  touched = null,
  placeholder = '',
}) => {
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        {label}
      </FormLabel>
      <Field
        autoComplete={'off'}
        name={fieldName}
        id={fieldName}
        type={type}
        as={Input}
        fontSize="md"
        variant="riftly"
        ms="4px"
        placeholder={placeholder}
      />

      <FormErrorMessage fontSize="md" name={fieldName}>
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}

export const RequiredTextAreaInput = ({ label, fieldName, error, touched, placeholder = '' }) => {
  return (
    <FormControl isRequired isInvalid={error && touched}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        {label}
      </FormLabel>
      <Field
        name={fieldName}
        type="text"
        as={Textarea}
        fontSize="md"
        ms="4px"
        size="sm"
        color="white"
        border="1px solid"
        borderColor="brand.neutral2"
        borderRadius="16px"
        bg="brand.neutral3"
        py="11px"
        resize="none"
        placeholder={placeholder}
      />

      <FormErrorMessage fontSize="md" name="text">
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}


export const NonRequiredTextAreaInput = ({ label, fieldName, error, touched, placeholder = '', ...rest }) => {
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel ms="4px" fontSize="md" fontWeight="bold">
        {label}
      </FormLabel>
      <Field
        name={fieldName}
        type="text"
        as={Textarea}
        fontSize="md"
        ms="4px"
        size="md"
        color="white"
        border="1px solid"
        borderColor="brand.neutral2"
        borderRadius="16px"
        bg="brand.neutral3"
        py="11px"
        resize="none"
        placeholder={placeholder}
        {...rest}
      />

      <FormErrorMessage fontSize="md" name="text">
        {error}
      </FormErrorMessage>
    </FormControl>
  )
}