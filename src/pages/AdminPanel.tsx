import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Product } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Layout } from '../components/Layout/Layout'
import { AddProductForm } from '../components/admin/AddProductForm'
import { ProductManagerGrid } from '../components/ProductManagerGrid'

interface ProductWithOffer extends Product {
  original_price?: number
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'offers'>('add')
  const [userProducts, setUserProducts] = useState<ProductWithOffer[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithOffer | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [stock, setStock] = useState(0)
  const [category, setCategory] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [selectedProductForOffer, setSelectedProductForOffer] = useState<ProductWithOffer | null>(null)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [offerStartDate, setOfferStartDate] = useState('')
  const [offerEndDate, setOfferEndDate] = useState('')
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)

  const fetchUserProducts = React.useCallback(async () => {
    if (!user) return

    setLoadingProducts(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      console.log('[PRODUTOS] fetchUserProducts resultado:', { error, data })

      if (error) throw error
      setUserProducts(data || [])
    } catch (error) {
      console.error('[PRODUTOS] Erro ao buscar produtos:', error)
      setMessage('Erro ao carregar produtos. A coluna user_id não existe na tabela products.')
    } finally {
      setLoadingProducts(false)
    }
  }, [user])

  useEffect(() => {
    if ((activeTab === 'manage' || activeTab === 'offers') && user) {
      fetchUserProducts()
    }
  }, [activeTab, user, fetchUserProducts])

  const handleProductAdded = () => {
    setMessage('Produto adicionado com sucesso!')
    setTimeout(() => setMessage(''), 3000)
    if (activeTab === 'manage') {
      fetchUserProducts()
    }
  }

  const handleMessage = (msg: string) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleEditProduct = (product: ProductWithOffer) => {
    setEditingProduct(product)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price)
    setStock(product.stock)
    setCategory(product.category)
    setImageUrl(product.image_url)
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editingProduct) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          description,
          price,
          stock,
          category,
          image_url: imageUrl
        })
        .eq('id', editingProduct.id)

      if (error) throw error

      setMessage('Produto atualizado com sucesso!')
      setShowEditModal(false)
      resetEditForm()
      fetchUserProducts()
    } catch (error) {
      console.error('Erro ao atualizar produto:', error)
      setMessage('Erro ao atualizar produto')
    } finally {
      setLoading(false)
    }
  }

  const resetEditForm = () => {
    setEditingProduct(null)
    setName('')
    setDescription('')
    setPrice(0)
    setStock(0)
    setCategory('')
    setImageUrl('')
  }

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProduct(productId)
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      setMessage('Produto excluído com sucesso!')
      fetchUserProducts()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      setMessage('Erro ao excluir produto')
    } finally {
      setDeletingProduct(null)
    }
  }

  const handleCreateOffer = (product: ProductWithOffer) => {
    setSelectedProductForOffer(product)
    setDiscountPercentage(0)
    setOfferStartDate('')
    setOfferEndDate('')
    setShowOfferModal(true)
  }

  const handleSaveOffer = async () => {
    if (!selectedProductForOffer || !discountPercentage) {
      console.warn('[OFERTA] Produto ou desconto inválido:', { selectedProductForOffer, discountPercentage })
      return
    }

    setLoading(true)
    try {
      const originalPrice = selectedProductForOffer.original_price ?? selectedProductForOffer.price
      const discountedPrice = originalPrice * (1 - discountPercentage / 100)

      console.log('[OFERTA] Tentando atualizar produto:', {
        id: selectedProductForOffer.id,
        is_on_offer: true,
        original_price: originalPrice,
        price: discountedPrice,
        discount_percentage: discountPercentage,
        offer_start_date: offerStartDate,
        offer_end_date: offerEndDate
      })

      // Verifique se o produto existe antes de atualizar
      const { data: checkData, error: checkError } = await supabase
        .from('products')
        .select('id, name')
        .eq('id', String(selectedProductForOffer.id))

      console.log('[OFERTA] Produto encontrado para update:', { checkError, checkData })

      if (checkError) throw checkError
      if (!checkData || checkData.length === 0) {
        console.error('[OFERTA] Nenhum produto encontrado com esse ID:', selectedProductForOffer.id)
        setMessage('Produto não encontrado para oferta.')
        setLoading(false)
        return
      }

      const { error, data } = await supabase
        .from('products')
        .update({
          is_on_offer: true,
          original_price: originalPrice,
          price: discountedPrice,
          discount_percentage: discountPercentage,
          offer_start_date: offerStartDate,
          offer_end_date: offerEndDate
        })
        .eq('id', String(selectedProductForOffer.id))
        .select()

      console.log('[OFERTA] Resultado update:', { error, data })

      if (Array.isArray(data) && data.length === 0) {
        console.warn('[OFERTA] Nenhum produto foi atualizado. Verifique se o ID está correto e se há permissões suficientes.')
      }
      if (error) throw error

      setMessage('Oferta criada com sucesso!')
      setShowOfferModal(false)
      setSelectedProductForOffer(null)
      await fetchUserProducts()
    } catch (error) {
      console.error('[OFERTA] Erro ao criar oferta:', error)
      setMessage('Erro ao criar oferta')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p>Faça login para acessar o painel administrativo</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo</h1>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('add')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Adicionar Produto
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gerenciar Produtos
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'offers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Criar Ofertas
            </button>
          </nav>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {/* Conteúdo das abas */}
        {activeTab === 'add' && (
          <AddProductForm
            onSuccess={handleProductAdded}
            onMessage={handleMessage}
          />
        )}

        {activeTab === 'manage' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Seus Produtos</h2>
            {loadingProducts ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : userProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Nenhum produto cadastrado</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-blue-600 text-gray-900 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Adicionar Primeiro Produto
                </button>
              </div>
            ) : (
              <ProductManagerGrid
                products={userProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onCreateOffer={handleCreateOffer}
                deletingProduct={deletingProduct}
              />
            )}
          </div>
        )}

        {activeTab === 'offers' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Gerenciar Ofertas</h2>
            {loadingProducts ? (
              <div className="text-center py-8">Carregando produtos...</div>
            ) : userProducts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Nenhum produto cadastrado</p>
                <button
                  onClick={() => setActiveTab('add')}
                  className="bg-blue-600 text-gray-900 px-4 py-2 rounded hover:bg-blue-700"
                >
                  Adicionar Primeiro Produto
                </button>
              </div>
            ) : (
              <div>
                {/* Produtos em oferta */}
                {userProducts.filter(p => p.is_on_offer).length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                      {/* Ícone de etiqueta */}
                      <svg className="w-6 h-6 text-green-600 inline-block" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Produtos com Ofertas Ativas ({userProducts.filter(p => p.is_on_offer).length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProducts.filter(product => product.is_on_offer).map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
                          <div className="relative">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded mb-4"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Produto'
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              OFERTA ATIVA
                            </div>
                            {product.discount_percentage && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                                -{Math.round(product.discount_percentage)}% OFF
                              </div>
                            )}
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                          
                          <div className="mb-2">
                            {product.original_price && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 line-through">
                                  R$ {product.original_price.toFixed(2)}
                                </span>
                                <span className="text-lg font-bold text-red-600">
                                  R$ {product.price.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-2">Estoque: {product.stock}</p>
                          
                          {product.offer_end_date && (
                            <p className="text-sm text-orange-600 mb-4">
                              ⏰ Válida até: {new Date(product.offer_end_date).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                            >
                              Editar
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Deseja remover esta oferta?')) {
                                  setLoading(true)
                                  try {
                                    const { error } = await supabase
                                      .from('products')
                                      .update({
                                        is_on_offer: false,
                                        original_price: null,
                                        discount_percentage: null,
                                        offer_start_date: null,
                                        offer_end_date: null,
                                        price: product.original_price || product.price
                                      })
                                      .eq('id', product.id)

                                    if (error) throw error
                                    setMessage('Oferta removida com sucesso!')
                                    fetchUserProducts()
                                  } catch (error) {
                                    console.error('Erro ao remover oferta:', error)
                                    setMessage('Erro ao remover oferta')
                                  } finally {
                                    setLoading(false)
                                  }
                                }
                              }}
                              className="flex-1 bg-orange-600 text-white py-2 px-3 rounded text-sm hover:bg-orange-700"
                            >
                              Remover Oferta
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Produtos sem oferta */}
                {userProducts.filter(p => !p.is_on_offer).length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-blue-600">
                       Produtos Disponíveis para Oferta ({userProducts.filter(p => !p.is_on_offer).length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProducts.filter(product => !product.is_on_offer).map(product => (
                        <div key={product.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded mb-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/E5E7EB/9CA3AF?text=Produto'
                            }}
                          />
                          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                          <p className="text-gray-600 mb-2 font-bold">R$ {product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500 mb-4">Estoque: {product.stock}</p>
                          <button
                            onClick={() => handleCreateOffer(product)}
                            className="w-full bg-white text-gray-900 py-2 px-4 rounded hover:bg-green-700 font-medium"
                          >
                             Criar Oferta
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caso não haja produtos */}
                {userProducts.length > 0 && userProducts.filter(p => !p.is_on_offer).length === 0 && userProducts.filter(p => p.is_on_offer).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhum produto disponível</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal de Edição */}
        {showEditModal && editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-3 w-full max-w-lg">
              <h3 className="text-lg font-semibold mb-3">Editar Produto</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Preço</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estoque</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Imagem</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  {imageUrl && (
                    <img src={imageUrl} alt="Preview" className="mt-2 w-12 h-12 object-cover rounded" />
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handleSaveEdit}
                  disabled={loading}
                  className="bg-blue-600 text-gray-700 px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    resetEditForm()
                  }}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Oferta */}
        {showOfferModal && selectedProductForOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white  rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Criar Oferta - {selectedProductForOffer.name}
              </h3>
              <p className="text-gray-600 mb-4">Preço atual: R$ {selectedProductForOffer.price.toFixed(2)}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desconto (%)
                  </label>
                  <input
                    type="number"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
                    min="1"
                    max="90"
                    className="w-full border border-gray-300 rounded px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0"
                    style={{ MozAppearance: 'textfield' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={offerStartDate}
                    onChange={(e) => setOfferStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                    style={{ colorScheme: 'light' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fim
                  </label>
                  <input
                    type="date"
                    value={offerEndDate}
                    onChange={(e) => setOfferEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-blue-500"
                    style={{ colorScheme: 'light' }}
                  />
                </div>

                {discountPercentage > 0 && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm text-blue-800">
                      Preço com desconto: R$ {(selectedProductForOffer.price * (1 - discountPercentage / 100)).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={handleSaveOffer}
                  disabled={loading || !discountPercentage}
                  className="bg-green-600 text-gray-900 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Oferta'}
                </button>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}