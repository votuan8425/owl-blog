import { Box, Flex, Link, Button } from '@chakra-ui/react'
import NextLink from 'next/link'
import {
	MeDocument,
	MeQuery,
	useLogoutMutation,
	useMeQuery
} from '../generated/graphql'
import { Reference, gql } from '@apollo/client'

import Image from 'next/image'
import ToggleDarkMode from './ToggleDarkMode'

const Navbar = () => {
	const { data, loading: useMeQueryLoading } = useMeQuery()
	const [logout, { loading: useLogoutMutationLoading }] = useLogoutMutation()

	const logoutUser = async () => {
		await logout({
			update(cache, { data }) {
				if (data?.logout) {
					cache.writeQuery<MeQuery>({
						query: MeDocument,
						data: { me: null }
					})

					cache.modify({
						fields: {
							posts(existing) {
								existing.paginatedPosts.forEach((post: Reference) => {
									cache.writeFragment({
										id: post.__ref,
										fragment: gql`
											fragment VoteType on Post {
												voteType
											}
										`,
										data: {
											voteType: 0
										}
									})
								})

								return existing
							}
						}
					})
				}
			}
		})
	}

	let body

	if (useMeQueryLoading) {
		body = null
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href='/login'>
					<Link mr={3} color="#CCCCCC">Login</Link>
				</NextLink>
				<NextLink href='/register' >
					<Link color="#CCCCCC">Register</Link>
				</NextLink>
			</>
		)
	} else {
		body = (
			<Flex>
				<NextLink href='/create-post'>
					<Button mr={4}>Create Post</Button>
				</NextLink>
				<Button onClick={logoutUser} isLoading={useLogoutMutationLoading}>
					Logout
				</Button>
			</Flex>
		)
	}


	return (
		<Box bg="gray.800" p={2}>
			<Flex maxW={1000} justifyContent='space-between' align='center' m='auto'>
				<NextLink href='/' style={{ display: "flex", alignItems: "center" }}>
					<Image src="/logo.png" width={90} height={78} alt='Logo' />
				</NextLink>
				<Flex align="center" gap={2}>
				<Box>{body}</Box>
					<ToggleDarkMode />
				</Flex>
			</Flex>
		</Box>
	)
}

export default Navbar