import { UseGuards } from "@nestjs/common";
import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";



@Resolver(of => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(returns => Boolean)
    hi() {
        return true;
    }

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args("input") createAccountInput: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            return this.usersService.createAccount(createAccountInput);
        } catch (error) {
            return {
                error: error,
                ok: false
            }
        }
    }


    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return await this.usersService.login(loginInput);
        } catch (error) {
            return {
                ok: false,
                error: error
            }
        }
    }

    @Query(returns => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async user(@Args() UserProfileInput: UserProfileInput): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.findById(UserProfileInput.userId);
            if (!user) {
                throw Error();
            }
            return {
                ok: true,
                user,
            }
        } catch (e) {
            return {
                error: 'User Not Found',
                ok: false,
            };
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutput)
    async editProfile(@AuthUser() authUser: User, @Args('input') editProfileInput: EditProfileInput): Promise<EditProfileOutput> {
        try {
            await this.usersService.editProfile(authUser.id, editProfileInput);
            return {
                ok: true,
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }
}