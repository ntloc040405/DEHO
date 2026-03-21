export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
salePrice?: number | null;
createdAt?: string | Date;
thumbnail: string;
sellCount: number;
  categoryId: {
      _id: string;
      name: string;
  };
  description: string;
}
export interface CategoryInterface {
_id: string;
name: string;
slug: string;
image: string | File; // Thay đổi kiểu dữ liệu của image thành string | File
// createdAt?: string;
updatedAt?: string;
}
