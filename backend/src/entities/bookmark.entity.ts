import { BookmarkType } from '@/enums/bookmark.enum';
import { IDataImportItem } from '@/modules/bookmark/bookmark.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bookmark')
export class BookmarkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  icon?: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  link?: string;

  @Column({
    type: 'enum',
    enum: BookmarkType,
    default: BookmarkType.WEB,
  })
  type: BookmarkType;

  @Column()
  order: number;

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => BookmarkEntity, (bookmark) => bookmark.id)
  @JoinColumn({ name: 'parentId' })
  parent?: BookmarkEntity;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  toExportItem(): IDataImportItem {
    return {
      icon: this.icon,
      title: this.title,
      link: this.link,
      type: this.type,
      order: this.order,
      children: [],
    };
  }

  static fromImportItem(
    bookmark: IDataImportItem & { parentId?: number },
  ): BookmarkEntity {
    const item = new BookmarkEntity();
    item.icon = bookmark.icon;
    item.title = bookmark.title;
    item.link = bookmark.link;
    item.type = bookmark.type;
    item.order = bookmark.order;
    item.parentId = bookmark.parentId;
    return item;
  }
}
