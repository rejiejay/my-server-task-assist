import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 18 })
    name: string;

    @Column({ length: 18 })
    password: string;

    @Column({ length: 16 })
    token: string;
}