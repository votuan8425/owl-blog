import { FieldError, User } from "../generated/graphql";

type Post = {
    id: number;
    title: string;
    userId: number;
    user: User;
    upvotes?: Upvote[];
    points: number;
    voteType: number;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

type Upvote = {
    userId: number;
    user: User;
    postId: number;
    post: Post;
    value: number;
}


export interface UserMutationResponse {
    code: number
    message: string
    success: boolean
    user: User
    error: FieldError[]
}

export interface NewUserInput {
    username: string;
    email: string;
    password: string;
}