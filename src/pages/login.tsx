import React from 'react'
import { Form, Formik } from "formik";
import { Box, Button, Flex } from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink  from "next/link";

const Login: React.FC<{}> = ({}) => {
    const router = useRouter()
    const [,login] = (useLoginMutation())
        return (
            <Wrapper variant='small'>
                <Formik initialValues={{usernameOrEmail:"",password:""}}
                onSubmit={async(values, {setErrors})=>{
                    const response = await login(values)
                    if(response.data?.login.errors){
                      setErrors(toErrorMap(response.data.login.errors))
                    }else if(response.data?.login.user){
                      router.push("/")
                    }
                    
                }}>
                    {({isSubmitting})=>(
                        <Form>
                            <InputField name='usernameOrEmail' placeholder='Username or Email' label='Username or Email' />
                            <Box mt={4}>
                                <InputField name='password' placeholder='password' label='password' type='password' />
                            </Box>
                            <Flex mt={2}>
                                <Button type='submit' colorScheme='teal' isLoading={isSubmitting}>Login</Button>
                                <Button ml='auto' colorScheme='red'><NextLink href="/forgot-password">Forgot password</NextLink></Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
           </Wrapper>
        );
}

export default withUrqlClient(createUrqlClient) (Login)