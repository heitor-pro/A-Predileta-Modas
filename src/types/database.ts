// Tipos gerados manualmente refletindo o schema em supabase/migrations.
// Para gerar automaticamente a partir do seu projeto real, use:
// npx supabase gen types typescript --project-id SEU_PROJECT_ID > src/types/database.ts

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'admin';
        };
        Update: Partial<{
          full_name: string | null;
        }>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
        };
        Update: Partial<{
          name: string;
          slug: string;
          sort_order: number;
        }>;
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number;
          promo_price: number | null;
          category_id: string;
          sizes: string[];
          colors: string[];
          stock: number;
          is_promo: boolean;
          is_featured: boolean;
          is_new: boolean;
          is_active: boolean;
          shipping_available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['products']['Row']> & {
          name: string;
          slug: string;
          price: number;
          category_id: string;
        };
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          storage_path: string;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          storage_path: string;
          is_primary?: boolean;
          sort_order?: number;
        };
        Update: Partial<{
          url: string;
          is_primary: boolean;
          sort_order: number;
        }>;
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          city: string;
          cep: string;
          address: string | null;
          delivery_method: string;
          items: unknown;
          subtotal: number;
          shipping: number;
          total: number;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
      settings: {
        Row: {
          key: string;
          value: string;
        };
        Insert: { key: string; value: string };
        Update: { value: string };
      };
    };
  };
}
