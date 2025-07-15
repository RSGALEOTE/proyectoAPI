import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Product } from './product.interface';
import Swal from 'sweetalert2';

interface EditableProduct extends Product {
  isEditing?: boolean;
  isVisible?: boolean;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class UsersComponent implements OnInit {
  products: EditableProduct[] = [];
  searchTerm: string = '';
  filteredProducts: EditableProduct[] = [];
  userProfile: UserProfile | null = null;
  defaultAvatar: string = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0yMCAyMS4wNFYxOWE0IDQgMCAwIDAtNC00SDhhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ij48L2NpcmNsZT48L3N2Zz4=';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  paginatedProducts: EditableProduct[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userAvatar = localStorage.getItem('userAvatar');
    const userRole = localStorage.getItem('userRole');

    if (userId && userName && userEmail) {
      this.userProfile = {
        id: parseInt(userId),
        name: userName,
        email: userEmail,
        role: userRole || 'user',
        avatar: userAvatar || this.defaultAvatar
      };
    } else {
      console.error('No user data found in localStorage');
      this.userProfile = {
        id: 0,
        name: 'Usuario',
        email: 'usuario@example.com',
        role: 'user',
        avatar: this.defaultAvatar
      };
    }
  }

  showUserProfile() {
  if (this.userProfile) {
    Swal.fire({
      title: 'Perfil de Usuario',
      html: `
        <div class="user-profile-card">
          <img src="${this.userProfile.avatar}" 
               alt="profile" 
               style="width: 100px; height: 100px; border-radius: 50%; margin-bottom: 15px;"
               onerror="this.onerror=null; this.src='${this.defaultAvatar}'">
          <div class="user-info">
            <p><strong>Nombre:</strong> ${this.userProfile.name}</p>
            <p><strong>Email:</strong> ${this.userProfile.email}</p>
            <p><strong>Rol:</strong> ${this.userProfile.role}</p>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'user-profile-popup',
        htmlContainer: 'user-profile-content'// ✅ cambio realizado aquí
      }
    });
  }
}


  loadProducts() {
    this.http.get<{products: Product[]}>('https://dummyjson.com/products')
      .subscribe(response => {
        this.products = response.products.map(product => ({
          ...product, 
          isEditing: false,
          isVisible: true
        }));
        this.filteredProducts = [...this.products];
        this.updatePagination();
      });
  }

  updatePagination() {
    const visibleProducts = this.products.filter(p => p.isVisible);
    this.totalPages = Math.ceil(visibleProducts.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProducts = visibleProducts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  searchProducts() {
    if (!this.searchTerm) {
      this.products.forEach(product => product.isVisible = true);
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      const searchWords = searchTermLower.split(' ');

      this.products.forEach(product => {
        const productData = [
          product.title || '',
          product.category || '',
          product.description || '',
          product.brand || '',
          product.price?.toString() || '',
          product.stock?.toString() || ''
        ].map(item => item.toLowerCase());

        product.isVisible = searchWords.every(word => 
          productData.some(field => field.includes(word))
        );
      });

      this.products.sort((a, b) => {
        if (a.isVisible && !b.isVisible) return -1;
        if (!a.isVisible && b.isVisible) return 1;
        if (a.isVisible && b.isVisible) {
          const aTitle = (a.title || '').toLowerCase().includes(searchTermLower);
          const bTitle = (b.title || '').toLowerCase().includes(searchTermLower);
          if (aTitle && !bTitle) return -1;
          if (!aTitle && bTitle) return 1;
        }
        return 0;
      });
    }
    
    this.currentPage = 1; // Reset to first page when searching
    this.updatePagination();
  }

  viewDetails(product: Product) {
    Swal.fire({
      title: product.title,
      html: `
        <div class="product-details">
          <img src="${product.images[0]}" alt="${product.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem;">
          <p><strong>Marca:</strong> ${product.brand}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
          <p><strong>Precio:</strong> $${product.price}</p>
          <p><strong>Descuento:</strong> ${product.discountPercentage}%</p>
          <p><strong>Stock:</strong> ${product.stock}</p>
          <p><strong>Rating:</strong> ${product.rating}/5</p>
          <p><strong>Descripción:</strong> ${product.description}</p>
        </div>
      `,
      width: '600px',
      showCloseButton: true,
      showConfirmButton: false,
    });
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimínalo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.products = this.products.filter(product => product.id !== id);
        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido eliminado.',
          'success'
        );
      }
    });
  }

  editProduct(product: EditableProduct) {
    product.isEditing = true;
  }

  saveProduct(product: EditableProduct) {
    product.isEditing = false;
    Swal.fire({
      title: '¡Guardado!',
      text: 'Los cambios han sido guardados',
      icon: 'success',
      timer: 1500
    });
  }

  addProduct() {
    Swal.fire({
      title: 'Agregar Producto',
      html: `
        <div class="form-group">
          <input id="title" class="swal2-input" placeholder="Título">
          <input id="price" type="number" class="swal2-input" placeholder="Precio">
          <input id="stock" type="number" class="swal2-input" placeholder="Stock">
          <input id="category" class="swal2-input" placeholder="Categoría">
          <input id="description" class="swal2-input" placeholder="Descripción">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const price = (document.getElementById('price') as HTMLInputElement).value;
        const stock = (document.getElementById('stock') as HTMLInputElement).value;
        const category = (document.getElementById('category') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;
        
        if (!title || !price || !stock || !category || !description) {
          Swal.showValidationMessage('Por favor llene todos los campos');
          return false;
        }
        
        return { title, price, stock, category, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newProduct: EditableProduct = {
          id: this.products.length + 1,
          title: result.value.title,
          price: parseFloat(result.value.price),
          stock: parseInt(result.value.stock),
          category: result.value.category,
          description: result.value.description,
          discountPercentage: 0,
          rating: 0,
          brand: 'Generic',
          thumbnail: 'https://via.placeholder.com/150',
          images: ['https://via.placeholder.com/150'],
          isEditing: false
        };
        
        this.products.unshift(newProduct);
        Swal.fire('¡Agregado!', 'El producto ha sido agregado.', 'success');
        Swal.fire('¡Agregado!', 'El producto ha sido agregado.', 'success');
      }
    });
  }}