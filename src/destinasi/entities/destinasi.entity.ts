
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Destinasi {
  @Field(() => Int)
  id!: number;

  @Field()
  nama!: string;

  @Field()
  kategori!: string;

  @Field({ nullable: true })
  lokasi?: string;

  @Field(() => Float)
  hargaTiket!: number;

  @Field(() => Float)
  ratingRata!: number;

  @Field(() => Date)
  createdAt!: Date;
}
