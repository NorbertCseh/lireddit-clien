import { Box, Flex, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react'
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useForgotPasswordMutation } from "../generated/graphql";

export const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false)
    const [, forgotPassword] = useForgotPasswordMutation()
        return (
            <Wrapper variant='small'>
                <Formik initialValues={{email:""}}
                onSubmit={async(values)=>{
                    await forgotPassword(values)
                    setComplete(true)
                }}>
                    {({isSubmitting})=>complete? <Box>Email is sent</Box>:(
                        <Form>
                            <InputField name='email' placeholder='Email' label='Email' type='Email' />
                            <Flex mt={2}>
                                <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>Send email</Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
           </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient,{ssr:false}) (ForgotPassword)