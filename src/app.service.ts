import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to my first Nest JS App';
  }

  getNameLength(): number {
    //return 'Welcome to My App';
    const name = 'Aamir';
    // alert(name);
    // alert(name.length);
    return name.length;
  }
}
