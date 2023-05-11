import { ReactNode } from 'react'
import Navbar from './Navbar'
import Wrapper from './Wrapper'
import Head from "next/head";

interface ILayoutProps {
    children: ReactNode
    title?: string
}

const Layout = ({ title, children }: ILayoutProps) => {
    return (
        <>
            <Head>
                <title>{title ? title + " - Owl Blog" : "Owl Blog"}</title>
                <meta name="description" content="Social site for learning and sharing knowledge" />
            </Head>
            <Navbar />
            <Wrapper>{children}</Wrapper>
        </>
    )
}

export default Layout