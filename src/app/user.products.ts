// ── Product ─────────────────────────────────────────────────────────────────
// Frontend-facing shape. ProductService maps the backend (libelle / prixVente)
// to these English field names so templates stay unchanged.
export interface Product {
  id: number;
  name: string;       // ← libelle
  price: number;      // ← prixVente
  imageUrl: string;   // ← imagePath (full URL)
  categoryId: number; // ← idCategorie
  description?: string;
  nbUnite?: number;
  seuil?: number;
  prixModifiable?: boolean;
}

// Raw shape returned by GET /api/products
export interface BackendProduct {
  id: number;
  libelle: string;
  description?: string;
  prixVente: number;
  idCategorie: number;
  nbUnite: number;
  seuil: number;
  prixModifiable: boolean;
  imagePath?: string;
}

// ── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string; // ← nom / name (service normalises both)
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginResponse {
  token: string;
  role: string;
  email: string;
  fullName: string;
}

// ── Orders ───────────────────────────────────────────────────────────────────
export interface OrderItemPayload {
  produitId: number;
  quantite: number;
}

export interface Order {
  id: number;
  statut: string;
  total?: number;
  clientNom?: string;
  items?: { produit?: BackendProduct; quantite: number }[];
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  activeUsers: number;
}

export interface DashboardAlert {
  id?: number;
  message: string;
  type?: string;
  produit?: string;
  stock?: number;
}

// ── Reclamation ───────────────────────────────────────────────────────────────
export interface Reclamation {
  id: number;
  sujet?: string;
  description?: string;
  status?: string;
  reponseAdmin?: string;
  ordreId?: number;
  clientNom?: string;
}

// ── Stock ─────────────────────────────────────────────────────────────────────
export interface StockItem {
  produitId: number;
  libelle?: string;
  quantiteDisponible: number;
  seuil?: number;
  categorie?: string;
  numeroLot?: string;
}

// ── Delivery ──────────────────────────────────────────────────────────────────
export interface Delivery {
  id: number;
  orderId: number;
  adresseLivraison: string;
  dateLivraisonPrevue: string;
  statut?: string;
  dateLivraisonReelle?: string;
}

// ── User profile ──────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  adresse?: string;
  role: string;
}

// ── Cart (local state) ────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}
