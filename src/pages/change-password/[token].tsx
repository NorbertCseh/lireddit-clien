import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { InputField } from '../../components/InputField';
import { Wrapper } from '../../components/Wrapper';
import { useChangePasswordMutation } from '../../generated/graphql';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { toErrorMap } from '../../utils/toErrorMap';
import NextLink  from "next/link";

export const ChangePassword: NextPage<{token:string}> = ({token}) => {
        const router = useRouter();
        const [,changePassword] = useChangePasswordMutation()
        const [tokenError,setTokenError] = useState('')
        return (<Wrapper variant='small'>
        <Formik initialValues={{newPassword:""}}
        onSubmit={async(values, {setErrors})=>{
            const response = await changePassword({newPassword:values.newPassword, token})
            if(response.data?.changePassword.errors){
                const errorMap = toErrorMap(response.data.changePassword.errors)
                setErrors(errorMap)
                if('token' in errorMap){
                    setTokenError(errorMap.token)
                }
                setErrors(errorMap)
            }else if(response.data?.changePassword.user){
              router.push("/login")
            }
            
        }}>
            {({isSubmitting})=>(
                <Form>
                    <InputField name='newPassword' placeholder='New password' label='New password' type='password'/>
                    {tokenError ? <Flex mt={2}> <Box color="red" mr={4} mt={2}>{tokenError}</Box> <Button background="tan"> <NextLink href="/forgot-password"> Send link again</NextLink> </Button> </Flex>:null}
                    <Button mt={4} type='submit' colorScheme='teal' isLoading={isSubmitting}>Change password</Button>
                </Form>
            )}
        </Formik>
   </Wrapper>);
}

ChangePassword.getInitialProps = ({query})=>{
    return{
        token:query.token as string
    }
}

export default withUrqlClient(createUrqlClient,{ssr:false}) (ChangePassword as any)