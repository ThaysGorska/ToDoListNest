import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes Unitários do Módulo Tarefa (e2e)', () => {
  let app: INestApplication;

  let tarefaId: number


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'db_todolist_test',
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        dropSchema: true
      }),
      AppModule
    ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

    it('1 - Inserir uma Tarefa no Banco', async () => {
    let response = await request(app.getHttpServer())
      .post('/tarefa')
      .send({
        nome: 'Cuidar do Timóteo',
        descricao: 'Limpar o cercadinho e colocar comida e água',
        responsavel: 'Thays',
        data: '2022-09-15',
        status: true
      })
      .expect(201)

      tarefaId = response.body.id
    })

    it('2 - Inserir uma Tarefa no Banco', async () => {
      let response = await request(app.getHttpServer())
        .post('/tarefa')
        .send({
          nome: 'Lavar a Louça',
          descricao: 'Lavar e secar a louça',
          responsavel: 'Leonardo',
          data: '2022-09-15',
          status: true
        })
        .expect(201)
  
        tarefaId = response.body.id
      })

    it('3 - Atualizar Tarefa', async () => {
      return request(app.getHttpServer())
        .put('/tarefa')
        .send({
          id: 1,
          nome: 'Cuidar do Timóteo - Atualizado',
          descricao: 'Limpar o cercadinho, colocar comida e água e fazer carinho',
          responsavel: 'Thays',
          data: '2022-09-15',
          status: false
        })
        .expect(200)
        .then(response => {
          expect('Cuidar do Timóteo - Atualizado').toEqual(response.body.nome)
        })
      })

      it('4 - Atualizar Tarefa', async () => {
        return request(app.getHttpServer())
          .put('/tarefa')
          .send({
            id: 1,
            nome: 'Lavar a Louça - Atualizado',
            descricao: 'Lavar e secar a louça e limpar o fogão',
            responsavel: 'Leonardo',
            data: '2022-09-15',
            status: false
          })
          .expect(200)
          .then(response => {
            expect('Lavar a Louça - Atualizado').toEqual(response.body.nome)
          })
        })

      it('5 - Não atualizar tarefa que não existe', async () => {
        return request(app.getHttpServer())
          .put('/tarefa')
          .send({
            id: 5,
            nome: 'Cuidar do Timóteo - Atualizado',
            descricao: 'Limpar o cercadinho, colocar comida e água e fazer carinho',
            responsavel: 'Thays',
            data: '2022-09-15',
            status: false
          })
          .expect(404)
      })

      it('6 - Recuperar Tarefa Específica', async () => {
        return request(app.getHttpServer())
          .get(`/tarefa/${tarefaId}`)
          .expect(200)
      })

      it('7 - Deletar Tarefa', async () => {
        return request(app.getHttpServer())
          .delete(`/tarefa/${tarefaId}`)
          .expect(204)
      })

    afterAll(async () => {
      await app.close()
    })


});
