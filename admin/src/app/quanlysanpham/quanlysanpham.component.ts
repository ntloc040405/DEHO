import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../services/product.service';
import { CategoryService, Category } from '../services/category.service';
import { FindCategoryPipe } from '../pipes/find-category.pipe';

@Component({
  selector: 'app-quanlysanpham',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, FindCategoryPipe],
  templateUrl: './quanlysanpham.component.html',
  styleUrls: ['./quanlysanpham.component.css'],
})
export class QuanlysanphamComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  categories: Category[] = [];
  searchQuery: string = '';
  userAvatar: string = '/assets/images/icon.png';
  errorMessage: string | null = null;
  showForm: boolean = false;
  editMode: boolean = false;
  currentProduct: Product & { thumbnailFile?: File; imageFiles?: File[]; thumbnailUrl?: string; imageUrls?: string[] } = {
    name: '',
    slug: '',
    description: '',
    price: 0,
    categoryId: ''
  };
  currentPage: number = 1;
  productsPerPage: number = 5;
  totalPages: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Vui lòng đăng nhập.';
      this.router.navigate(['/login']);
      return;
    }
    this.loadCategories();
    this.loadProducts();
    this.loadUserAvatar();
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('.icon').forEach((ico) => {
      const name = ico.classList[1]?.split('-')[1] || '';
      if (name) {
        ico.innerHTML = `<svg width="20" height="20"><use xlink:href="#${ico.classList[1]}" /></svg>`;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data || [];
        } else {
          this.errorMessage = response.message || 'Lỗi khi lấy danh mục.';
        }
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh mục:', err);
        this.errorMessage = 'Lỗi khi lấy danh mục: ' + (err.message || 'Không xác định');
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts({ name: this.searchQuery }).subscribe({
      next: (products) => {
        this.products = products || [];
        this.filteredProducts = this.products;
        this.updatePagination();
        this.errorMessage = null;
        console.log('Sản phẩm:', this.products);
      },
      error: (err) => {
        console.error('Lỗi khi lấy sản phẩm:', err);
        this.errorMessage = err.status === 401 || err.status === 403
          ? 'Không có quyền truy cập. Vui lòng đăng nhập lại.'
          : 'Lỗi khi lấy sản phẩm: ' + (err.message || 'Không xác định');
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadUserAvatar(): void {
    const avatar = localStorage.getItem('userAvatar') || '/assets/images/icon.png';
    this.userAvatar = avatar;
  }

  search(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  showAddForm(): void {
    this.showForm = true;
    this.editMode = false;
    this.currentProduct = { name: '', slug: '', description: '', price: 0, categoryId: '' };
  }

  showEditForm(product: Product): void {
    if (!product._id) {
      this.errorMessage = 'Sản phẩm không có ID hợp lệ.';
      return;
    }
    this.showForm = true;
    this.editMode = true;
    this.currentProduct = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      salePrice: product.salePrice,
      categoryId: product.categoryId,
      thumbnail: product.thumbnail,
      images: product.images,
      thumbnailUrl: product.thumbnail ? `http://localhost:3000${product.thumbnail}` : undefined,
      imageUrls: product.images?.map(img => `http://localhost:3000${img}`)
    };
    console.log('Current product:', this.currentProduct);
  }

  onThumbnailChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.currentProduct.thumbnailFile = input.files[0];
      this.currentProduct.thumbnailUrl = URL.createObjectURL(input.files[0]);
    }
  }

  onImagesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.currentProduct.imageFiles = Array.from(input.files);
      this.currentProduct.imageUrls = this.currentProduct.imageFiles.map(file => URL.createObjectURL(file));
    }
  }

  saveProduct(): void {
    if (!this.currentProduct.name || !this.currentProduct.slug || !this.currentProduct.description || !this.currentProduct.price || !this.currentProduct.categoryId) {
      this.errorMessage = 'Vui lòng điền đầy đủ các trường bắt buộc.';
      return;
    }

    const productData = {
      name: this.currentProduct.name,
      slug: this.currentProduct.slug,
      description: this.currentProduct.description,
      price: this.currentProduct.price,
      salePrice: this.currentProduct.salePrice,
      categoryId: this.currentProduct.categoryId,
      thumbnail: this.currentProduct.thumbnailFile,
      images: this.currentProduct.imageFiles
    };

    if (this.editMode) {
      if (!this.currentProduct._id) {
        this.errorMessage = 'Không tìm thấy ID sản phẩm để cập nhật.';
        return;
      }
      console.log('Gửi cập nhật sản phẩm:', { id: this.currentProduct._id, data: productData });
      this.productService.updateProduct(this.currentProduct._id, productData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
            this.closeForm();
            this.errorMessage = null;
          } else {
            this.errorMessage = response.message || 'Lỗi khi cập nhật sản phẩm.';
          }
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật sản phẩm:', err);
          this.errorMessage = err.error?.message || err.message || 'Lỗi khi cập nhật sản phẩm: Không xác định';
        }
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
            this.closeForm();
            this.errorMessage = null;
          } else {
            this.errorMessage = response.message || 'Lỗi khi thêm sản phẩm.';
          }
        },
        error: (err) => {
          console.error('Lỗi khi thêm sản phẩm:', err);
          this.errorMessage = err.error?.message || err.message || 'Lỗi khi thêm sản phẩm: Không xác định';
        }
      });
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
            this.errorMessage = null;
          } else {
            this.errorMessage = response.message || 'Lỗi khi xóa sản phẩm.';
          }
        },
        error: (err) => {
          console.error('Lỗi khi xóa sản phẩm:', err);
          this.errorMessage = err.error?.message || err.message || 'Lỗi khi xóa sản phẩm: Không xác định';
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.currentProduct = { name: '', slug: '', description: '', price: 0, categoryId: '' };
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userAvatar');
    this.router.navigate(['/login']);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const endIndex = startIndex + this.productsPerPage;
    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
