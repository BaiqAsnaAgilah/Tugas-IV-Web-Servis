import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { Destinasi } from './entities/destinasi.entity.js';
import { Ulasan } from '../ulasan/entities/ulasan.entity.js';
import { Fasilitas } from '../fasilitas/entities/fasilitas.entity.js';
import { CreateUlasanInput } from '../ulasan/dto/create-ulasan.input.js';

import { DestinasiService } from './destinasi.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Resolver(() => Destinasi)
export class DestinasiResolver {
  constructor(
    private readonly destinasiService: DestinasiService,
    private readonly prisma: PrismaService,
  ) {}

  // Mengambil data destinasi berdasarkan ID
  @Query(() => Destinasi, { name: 'destinasi' })
  async getDestinasi(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.destinasiService.findOne(id);
  }

  // Query untuk pengujian GraphQL
  @Query(() => String, { name: 'hello' })
  hello(): string {
    return 'GraphQL WisataKu berhasil dijalankan!';
  }

  // Mengambil 3 ulasan terbaru
  @ResolveField(() => [Ulasan], { name: 'ulasan' })
  async getUlasan(@Parent() destinasi: Destinasi) {
    return this.prisma.ulasan.findMany({
      where: { destinasiId: destinasi.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  }

  // Mengambil fasilitas destinasi
  @ResolveField(() => [Fasilitas], { name: 'fasilitas' })
  async getFasilitas(@Parent() destinasi: Destinasi) {
    return this.prisma.fasilitas.findMany({
      where: { destinasiId: destinasi.id },
    });
  }

  // Menambahkan ulasan melalui GraphQL
  @Mutation(() => Ulasan, { name: 'tambahUlasan' })
  async tambahUlasan(
    @Args('input', { type: () => CreateUlasanInput })
    input: CreateUlasanInput,
  ) {
    // Memeriksa data yang diterima dari GraphQL
    console.log('DATA INPUT:', input);
    console.log('ISI INPUT:', Object.keys(input ?? {}));

    return this.prisma.ulasan.create({
      data: {
        destinasiId: input.destinasiId,
        rating: input.rating,
        komentar: input.komentar,
      },
    });
  }
}
