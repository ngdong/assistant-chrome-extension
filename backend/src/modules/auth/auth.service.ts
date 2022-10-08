import { UserEntity } from '@/entities/user.entity';
import { UserRepository } from '@/repositories/user.repository';
import { ILoginDto, IRegisterDto } from '@/modules/auth/auth.interface';
import token from '@/utils/token';
import ValidationException from '@/exceptions/validation.exception';

class AuthService {
  private userRepository: typeof UserRepository;
  constructor() {
    this.userRepository = UserRepository;
  }

  /**
   * Attempt to register a user
   */
  public async register(registerInput: IRegisterDto): Promise<string | Error> {
    const { username } = registerInput;
    const userInput = new UserEntity();
    userInput.forEntity(registerInput);

    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new ValidationException([
        {
          message: 'Username already taken',
          field: 'username',
        },
      ]);
    }
    const userCreated = await this.userRepository.save(userInput);
    if (!userCreated) {
      throw new Error('Field to create a user');
    }
    const accessToken = token.createToken(userCreated);

    return accessToken;
  }

  /**
   * Authenticate user by username and password.
   */
  public async login(input: ILoginDto): Promise<string | Error> {
    const { username, password } = input;
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new Error('Wrong credentials given');
    }

    if (user.checkIfUnencryptedPasswordIsValid(password)) {
      return token.createToken(user);
    } else {
      throw new Error('Wrong credentials given');
    }
  }
}

export default AuthService;
