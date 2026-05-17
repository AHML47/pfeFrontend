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
  id?: number;
  idP?: number;
  Id?: number;
  libelle?: string;
  Libelle?: string;
  description?: string;
  Description?: string;
  prixVente?: number;
  PrixVente?: number;
  prixVenteActuel?: number;
  PrixVenteActuel?: number;
  prix?: number;
  prixAchat?: number;
  idCategorie?: number;
  IdCategorie?: number;
  categoryId?: number;
  nbUnite?: number;
  NbUnite?: number;
  seuil?: number;
  Seuil?: number;
  prixModifiable?: boolean;
  PrixModifiable?: boolean;
  imagePath?: string;
  imageUrl?: string | null;
  ImageUrl?: string | null;
}

// ── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string; // ← nom / name (service normalises both)
}

export interface BackendCategory {
  id?: number;
  Id?: number;
  nom?: string;
  Nom?: string;
  description?: string;
  Description?: string;
  parentId?: number | null;
  ParentId?: number | null;
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
  userId?: number;
  totalProduits?: number;
  totalFinal?: number;
  dateCommande?: string;
  items?: { produit?: BackendProduct; quantite: number }[];
}

export interface OrderDetail {
  id: number;
  orderId: number;
  produitId: number;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
  produit?: BackendProduct;
}

export interface ApiOrder {
  id?: number;
  Id?: number;
  userId?: number;
  UserId?: number;
  dateCommande?: string;
  DateCommande?: string;
  totalProduits?: number;
  TotalProduits?: number;
  fraisLivraison?: number;
  FraisLivraison?: number;
  totalFinal?: number;
  TotalFinal?: number;
  statut?: string;
  Statut?: string;
  delivery?: Delivery;
  Delivery?: Delivery;
  orderDetails?: OrderDetail[];
  OrderDetails?: OrderDetail[];
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  revenue: number;
  totalOrders: number;
  activeUsers: number;
}

export interface DashboardStatsApi {
  TotalProduits: number;
  TotalCommandes: number;
  CommandesEnAttente: number;
  StockBas: number;
  StockNegatif: number;
  ChiffreAffairesMois: number;
}

export interface DashboardAlert {
  id?: number;
  message: string;
  type?: string;
  produit?: string;
  stock?: number;
}

export interface DashboardAlertApi {
  Produit: string;
  Stock: number;
  EstCritique: boolean;
}

// ── Reclamation ───────────────────────────────────────────────────────────────
export interface Reclamation {
  id: number;
  sujet?: string;
  description?: string;
  status?: string;
  reponseAdmin?: string;
  orderId?: number;
  userId?: string;
  dateCreation?: string;
  dateResolution?: string | null;
  resolvedByUserId?: string | null;
  clientNom?: string;
}

export interface ReclamationApi {
  Id?: number;
  OrderId?: number;
  UserId?: string;
  Sujet?: string;
  Description?: string;
  Status?: string;
  ReponseAdmin?: string;
  DateCreation?: string;
  DateResolution?: string | null;
  ResolvedByUserId?: string | null;
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

export interface StockTransaction {
  Id: number;
  StockLotId: number;
  OrderDetailId?: number | null;
  Type: string;
  Quantite: number;
  DateMouvement: string;
}

export interface StockDetailsApi {
  StockLotId: number[];
  Product: { idP?: number; Id?: number };
  QuantiteTotalRestante: number;
  Transations: StockTransaction[];
}

export interface StockLot {
  Id: number;
  AchatLotId: number;
  QuantiteRestante: number;
  DateReception: string;
  ExpirationDate?: string | null;
  ProduitId: number;
  RowVersion?: string;
  AchatLot?: AchatLot;
}

export interface AchatLot {
  Id: number;
  ProduitId: number;
  DateAchat?: string;
  QuantiteAchetee: number;
  PrixUnitaire: number;
  Fournisseur: string;
  SupplierId?: number;
  NumeroLot?: string;
  StockLots?: { Id: number }[];
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

export interface DeliveryTodayProduct {
  Produit: string;
  Quantite: number;
  Prix: number;
  OrderId: number;
}

export interface DeliveryTodayClient {
  DeliveryId: number;
  OrderId: number;
  Adresse: string;
  Statut: string;
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

export interface UserProfileApi {
  Id: number;
  Nom: string;
  Prenom: string;
  Email: string;
  Adresse?: string;
  Role: string;
}

// ── Cart (local state) ────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PanierItemDto {
  ProduitId: number;
  Libelle: string;
  Quantite: number;
  PrixUnitaire: number;
  SousTotal: number;
  ImageUrl?: string;
}

export interface PanierDto {
  UserId: number;
  TotalPrix: number;
  Items: PanierItemDto[];
}

export interface Config {
  Id: number;
  MontantMinimumCommande: number;
  ProfitPercentage: number;
  FraisLivraison: number;
  SeuilAlerteStockBas: number;
}

export interface NotificationMessage {
  Message: string;
  Type: string;
  CreatedAt: string;
}
