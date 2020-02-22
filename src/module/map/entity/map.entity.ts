import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAssisMap {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 18 })
    key: string;

    @Column({ type: 'longtext', nullable: true })
    value: string;
}