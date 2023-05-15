import { Formik, Form, FormikHelpers } from 'formik'
import { Button, Box, Flex, Spinner, useToast, Link } from '@chakra-ui/react'
import Wrapper from '../components/Wrapper'
import InputField from '../components/InputField'

import {
	MeDocument,
	MeQuery,
	RegisterInput,
	useRegisterMutation
} from '../generated/graphql'
import { mapFieldErrors } from '../helpers/mapFieldErrors'
import { useRouter } from 'next/router'
import { useCheckAuth } from '../utils/useCheckAuth'
import Head from 'next/head'
import NextLink from 'next/link'


const Register = () => {
	const router = useRouter()

	const { data: authData, loading: authLoading } = useCheckAuth()

	const initialValues: RegisterInput = { username: '', email: '', password: '' }

	const [registerUser, { loading: _registerUserLoading, error }] =
		useRegisterMutation()

	const toast = useToast()

	const onRegisterSubmit = async (
		values: RegisterInput,
		{ setErrors }: FormikHelpers<RegisterInput>
	) => {
		const response = await registerUser({
			variables: {
				registerInput: values
			},
			update(cache, { data }) {
				if (data?.register?.success) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: data.register.user }
					})
				}
			}
		})

		if (response.data?.register?.errors) {
			setErrors(mapFieldErrors(response.data.register.errors))
		} else if (response.data?.register?.user) {
			// register successfully
			toast({
				title: 'Welcome',
				description: `${response.data.register.user.username}`,
				status: 'success',
				duration: 3000,
				isClosable: true
			})
			router.push('/')
		}
	}

	return (
		<>
			<Head>
				<title>Login - Owl Blog</title>
				<meta name="description" content="Social site for learning and sharing knowledge" />
			</Head>
			{authLoading || (!authLoading && authData?.me) ? (
				<Flex justifyContent='center' alignItems='center' minH='100vh'>
					<Spinner />
				</Flex>
			) : (
				<Wrapper size='small'>
					{error && <p>Failed to register. Internal server error</p>}
					<Formik initialValues={initialValues} onSubmit={onRegisterSubmit}>
						{({ isSubmitting }) => (
							<Form>
								<InputField
									name='username'
									placeholder='Username'
									label='Username'
									type='text'
								/>
								<Box mt={4}>
									<InputField
										name='email'
										placeholder='Email'
										label='Email'
										type='text'
									/>
								</Box>
								<Box mt={4}>
									<InputField
										name='password'
										placeholder='Password'
										label='Password'
										type='password'
									/>
								</Box>
									<Flex mt={2}>
										<NextLink href='/login'>
											<Link ml='auto'>I already have an account ?</Link>
										</NextLink>
									</Flex>
								<Button
									type='submit'
									colorScheme='teal'
									mt={4}
									isLoading={isSubmitting}
								>
									Register
								</Button>
							</Form>
						)}
					</Formik>
				</Wrapper>
			)}
		</>
	)
}

export default Register