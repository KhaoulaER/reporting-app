import { Module } from '@nestjs/common';
import { Result } from './result/result.model';

@Module({
    providers: [Result],
    exports: [Result]
})
export class SharedModule {}
