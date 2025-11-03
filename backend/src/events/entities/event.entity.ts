import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELED = 'canceled',
}

@Table({
  tableName: 'events',
  timestamps: true,
})
export class Event extends Model<Event> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare location: string;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare datetime: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  declare price: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare maxTicketAmount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.ENUM(...Object.values(EventStatus)),
    allowNull: false,
    defaultValue: EventStatus.DRAFT,
  })
  declare status: EventStatus;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}