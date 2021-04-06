import mongoose, { Schema, Types } from 'mongoose';
import { QueueDoc } from '../types/queue.types';

const QueueSchema = new Schema(
  {
    pipedriveDealId: Number,
    cliente: {
      nome: String,
      tipoPessoa: String,
      endereco: String,
      cpf_cnpj: String,
      ie: String,
      numero: String,
      complemento: String,
      bairro: String,
      cep: String,
      cidade: String,
      uf: String,
      fone: String,
      email: String,
    },
    itens: [
      {
        item: {
          codigo: String,
          descricao: String,
          un: String,
          qtde: String,
          vlr_unit: String,
        }
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc: QueueDoc, ret: QueueDoc) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface QueueModel extends mongoose.Model<QueueDoc> { }

const Queue = mongoose.model<QueueDoc, QueueModel>('Queue', QueueSchema);

Queue.createCollection({});

export default Queue;
