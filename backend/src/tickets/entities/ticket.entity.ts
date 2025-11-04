import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { Event } from '../../events/entities/event.entity';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus {
  ACTIVE = 'active',
  USED = 'used',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}

@Table({
  tableName: 'tickets',
  timestamps: true,
})
export class Ticket extends Model<Ticket> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Index({ unique: true })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare uuid: string;

  @ForeignKey(() => Event)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare eventId: number;

  @BelongsTo(() => Event, { onDelete: 'CASCADE' })
  declare event: Event;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  declare user: User;

  @Column({
    type: DataType.ENUM(...Object.values(TicketStatus)),
    allowNull: false,
    defaultValue: TicketStatus.ACTIVE,
  })
  declare status: TicketStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  declare usedAt?: Date;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}