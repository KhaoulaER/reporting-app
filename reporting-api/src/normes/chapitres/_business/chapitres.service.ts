import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChapitreDto } from '../dto/create-chapitre.dto'; 
import { UpdateChapitreDto } from '../dto/update-chapitre.dto'; 
import { Chapitre } from '../entities/chapitre.entity';
import { Norme } from 'src/normes/entities/norme.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateNormeDto } from 'src/normes/dto/create-norme.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadChaptersWithControlPointsDto } from '../dto/upload-chapitre-pc';
import { PointsControle } from '../points-controle/entities/points-controle.entity';


@Injectable()
export class ChapitresService {
  constructor(
    @InjectRepository(Chapitre) private chapitreRepository:Repository<Chapitre>,
    @InjectRepository(PointsControle) private pointsControleRepository:Repository<PointsControle>,
    @InjectRepository(Norme) private normeRepository:Repository<Norme>,
    private readonly entityManager: EntityManager
  ){}

  //UPLOAD EXCEL FILE
  async uploadChaptersWithControlPoints(normeId: string, data: UploadChaptersWithControlPointsDto[]): Promise<any> {
    const norme = await this.normeRepository.findOne({ where: { id: normeId } });

    if (!norme) {
      throw new NotFoundException('Norme not found');
    }

    console.log('data:',data)
    for (const item of data) {
      console.log('item: ',item)
      // Create and save the chapter
      const chapitres = this.chapitreRepository.create({
        titre: item.chapitre || 'titre i',
        //description: item.chapitre.description,
        norme: norme, // associate with norme
      });
      const savedChapitre = await this.chapitreRepository.save(chapitres);

      // Create and save control points associated with the chapter
      for (const pc of item.pointsControle) {
        const pointControle = this.pointsControleRepository.create({
          designation: pc.designation,
          objectif: pc.objectif,
          chapitre: savedChapitre // associate with the chapter
        });
        await this.pointsControleRepository.save(pointControle);
      }
    }

    return { message: 'Chapters and control points uploaded successfully' };
  }
  

 
  async create(normeId:string,createChapitreDto: CreateChapitreDto) {
    const norme = await this.normeRepository.findOne({where: {id:normeId}});
    if (!norme) {
      throw new NotFoundException('Norme not found');
    }
    const chapitre = this.chapitreRepository.create({ ...createChapitreDto, norme });
    return this.entityManager.save(chapitre);
  }

  async findAllByNorme(normeId:string): Promise<Chapitre[]>{
    return this.chapitreRepository.find({where: { norme: { id: normeId } }});
  }

  async findChapitresWithPointsByNorme(normeId: string): Promise<Chapitre[]> {
    return this.chapitreRepository.find({
      where: { norme: { id: normeId } },
      relations: ['pointsControle','pointsControle.preuve'],
    });
  }
  findAll() {
    return `This action returns all chapitres`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chapitre`;
  }

  async update(id: string, updateChapitreDto: UpdateChapitreDto) {
    const chapitre = await this.chapitreRepository.findOneBy({id});
    chapitre.titre=updateChapitreDto.titre;
    await this.entityManager.save(chapitre);
  }

  remove(id: string) {
    return this.chapitreRepository.delete(id);
  }
}
