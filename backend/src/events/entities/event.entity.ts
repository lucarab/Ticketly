import { Table, Column, Model, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, Index, HasMany } from 'sequelize-typescript';
import { Ticket } from '../../tickets/entities/ticket.entity';

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
    get(this: Event) {
      const raw = this.getDataValue('price') as unknown as string | number | null;
      if (raw === null || raw === undefined) return 0;
      return typeof raw === 'number' ? raw : parseFloat(String(raw));
    },
    set(this: Event, value: number) {
      const num = Number(value);
      const rounded = Number.isFinite(num) ? parseFloat(num.toFixed(2)) : 0;
      this.setDataValue('price', rounded);
    },
  })
  declare price: number;

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

  @HasMany(() => Ticket, { onDelete: 'CASCADE' })
  declare tickets: Ticket[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}