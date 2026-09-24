import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProducts, patchProduct } from '../lib/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

function hasUserPurchasedProduct(user, productId) {
  if (!user) return false;
  const pIdStr = String(productId).trim();
  try {
    const raw = localStorage.getItem('syrnaya-palitra:orders:v1');
    if (raw) {
      const orders = JSON.parse(raw);
      if (Array.isArray(orders)) {
        const found = orders.some((order) => {
          if (order?.userId && user?.id && String(order.userId).trim() !== String(user.id).trim()) {
            return false;
          }
          const items = Array.isArray(order?.items) ? order.items : [];
          return items.some((item) => String(item?.id).trim() === pIdStr || String(item?.productId).trim() === pIdStr);
        });
        if (found) return true;
      }
    }
  } catch (e) {}

  if (Array.isArray(user?.orders)) {
    const found = user.orders.some((order) => {
      const items = Array.isArray(order?.items) ? order.items : [];
      return items.some((item) => String(item?.id).trim() === pIdStr || String(item?.productId).trim() === pIdStr);
    });
    if (found) return true;
  }

  return false;
}

function trimProduct(prod) {
  if (!prod) return prod;
  const c = { ...prod };
  ["name","weight","category","milk","additives","age","features","wine","image"].forEach(k=>{ if(typeof c[k]==="string") c[k]=c[k].trim(); });
  if(c.description) c.description=Object.fromEntries(Object.entries(c.description).map(([k,v])=>[k,typeof v==="string"?v.trim():v]));
  [["ingredients"],["shelfLife"]].flat().forEach(k=>{ if(typeof c[k]==="string") c[k]=c[k].trim(); });
  if(Array.isArray(c.images)) c.images=c.images.map(s=>typeof s==="string"?s.trim():s);
  if(Array.isArray(c.reviews)) c.reviews=c.reviews.map(r=>({ ...r, author:typeof r.author==="string"?r.author.trim():r.author, date:typeof r.date==="string"?r.date.trim():r.date, pairing:typeof r.pairing==="string"?r.pairing.trim():r.pairing, text:typeof r.text==="string"?r.text.trim():r.text }));
  return c;
}

export default function Product() {
  const { id } = useParams();
  const { add, items } = useCart();
  const { user } = useAuth();
  const { push } = useToast();
  const [product,setProduct]=useState(null);
  const [allProducts,setAllProducts]=useState([]);
  const [activeTab,setActiveTab]=useState('desc');
  const [mainImg,setMainImg]=useState('');
  const [selectedWeight,setSelectedWeight]=useState(100);
  const pack = selectedWeight;
  const [brokenImages,setBrokenImages]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [btnText,setBtnText]=useState(null);
  const timerRef = useRef(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewPhotos, setReviewPhotos] = useState(['', '', '']);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fileInputRef0 = useRef(null);
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);
  const fileInputRefs = [fileInputRef0, fileInputRef1, fileInputRef2];

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewText('');
    setReviewRating(0);
    setReviewPhotos(['', '', '']);
  };

  useEffect(() => {
    if (!isReviewModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeReviewModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewModalOpen]);

  const handleOpenReviewModal = () => {
    if (!user) {
      push('Войдите, чтобы оставить отзыв'.trim(), 'error');
      return;
    }
    if (!hasUserPurchasedProduct(user, product.id)) {
      push('Отзыв доступен после покупки товара'.trim(), 'error');
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handlePhotoClick = (index) => {
    if (fileInputRefs[index]?.current) {
      fileInputRefs[index].current.click();
    }
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      // ASSUMPTION: фото загружаются локально для предпросмотра (objectURL) и не отправляются в БД
      const url = URL.createObjectURL(file);
      setReviewPhotos((prev) => {
        const next = [...prev];
        next[index] = url;
        return next;
      });
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || reviewRating === 0 || isSubmittingReview) return;
    setIsSubmittingReview(true);
    try {
      const newReview = {
        id: (product.reviews && product.reviews.length > 0)
          ? Math.max(...product.reviews.map((r) => Number(r.id) || 0)) + 1
          : 1,
        author: (user?.name || '').trim(),
        date: new Date().toISOString().trim(),
        rating: Number(reviewRating),
        text: reviewText.trim(),
      };
      const nextReviews = [...(product.reviews || []), newReview];
      await patchProduct(product.id, {
        reviews: nextReviews,
      });
      setProduct((prev) => ({
        ...prev,
        reviews: nextReviews,
      }));
      setActiveTab('reviews');
      push('Отзыв опубликован'.trim(), 'success');
      closeReviewModal();
    } catch (err) {
      push((err?.message || 'Ошибка отправки отзыва').trim(), 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(()=>{
    let cancelled=false;
    setLoading(true);
    Promise.all([getProduct(id),getProducts()])
      .then(([pp,list])=>{
        if(cancelled) return;
        const tp=trimProduct(pp);
        setProduct(tp);
        setMainImg((tp.images&&tp.images[0])||tp.image||'');
        setAllProducts((list||[]).map(trimProduct));
      })
      .catch(e=>{ if(!cancelled) setError(e.message); })
      .finally(()=>{ if(!cancelled) setLoading(false); });
    return()=>{ cancelled=true; };
  },[id]);

  const deliveryDate=useMemo(()=>{
    const d=new Date(Date.now()+86400000);
    return d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
  },[]);

  if(loading) return <div className="max-w-[1200px] mx-auto px-4 py-8 font-montserrat">Загрузка...</div>;
  if(error) return <div className="max-w-[1200px] mx-auto px-4 py-8">Ошибка: {error}</div>;
  if(!product) return <div className="max-w-[1200px] mx-auto px-4 py-8">Сыр не найден</div>;

  const stock=product.stock??(product.inStock?5:0);
  const isOut=stock===0||product.inStock===false;
  const mainImage=product.image||'';
  const rawImages=(product.images&&product.images.length)?product.images:[mainImage].filter(Boolean);
  const visibleImages=rawImages.filter(img=>!brokenImages.includes(img));
  const images=visibleImages.length?visibleImages:[mainImage].filter(Boolean);
  const currentPrice=Math.round(product.price*(selectedWeight/100));
  const related=allProducts.filter(pp=>pp.category===product.category && String(pp.id)!==String(product.id)).slice(0,4);
  const reviews=product.reviews||[];
  const avgRating=reviews.length?Math.round(reviews.reduce((s,r)=>s+(Number(r.rating)||0),0)/reviews.length*10)/10:0;
  const reviewsWord=(n=>{const a=n%100;if(a>=11&&a<=14)return 'отзывов';const b=n%10;if(b===1)return 'отзыв';if(b>=2&&b<=4)return 'отзыва';return 'отзывов';});
  const starsRow=(rating)=>(<span className="flex gap-1.5" aria-label={`Оценка ${rating} из 5`}>{[1,2,3,4,5].map(d=>(<span key={d} className={`w-3 h-3 rounded-full ${d<=rating?"bg-brand-900":"bg-surface-gray-fill border border-neutral-300"}`} />))}</span>);

  const handleImgError=(src)=>{
    setBrokenImages(prev=>prev.includes(src)?prev:[...prev,src]);
    if(mainImg===src && mainImage && src!==mainImage) setMainImg(mainImage);
    else if(mainImg===src) setMainImg('');
  };

  const tabBtn=(key,label)=>(
    <button onClick={()=>setActiveTab(key)} className={`pb-3 border-b-2 font-montserrat text-base font-semibold transition-colors ${activeTab===key?"border-accent-gold text-brand-900":"border-transparent text-neutral-500 hover:text-neutral-900-alt"}`}>{label}</button>
  );

  return (
    <div className="bg-surface-cream min-h-screen pb-[100px]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-6">
        <nav className="text-xs text-neutral-350 mb-5 font-montserrat">
          <Link to="/" className="hover:text-brand-900">Главная</Link> / <Link to="/catalog" className="hover:text-brand-900">Каталог</Link> / <span className="text-neutral-700">{product.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-10 lg:gap-14 mb-10">
          <div>
            <div className="rounded-radius-lg overflow-hidden bg-surface-white border border-neutral-300">
              <img src={mainImg||mainImage} alt={product.name} onError={()=>handleImgError(mainImg||mainImage)} className="w-full object-cover aspect-[4/3] block" />
            </div>
            {images.length>1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img,i)=>(
                  <button key={img+i} onClick={()=>setMainImg(img)} className={`w-20 h-20 rounded-radius-md overflow-hidden border-2 ${(mainImg||mainImage)===img?"border-brand-900":"border-neutral-300"}`}><img src={img} alt="thumb" onError={()=>handleImgError(img)} className="w-full h-full object-cover" /></button>
                ))}
              </div>
            )}
          </div>
          <div className="font-montserrat">
            <h1 className="font-lora text-2xl lg:text-3xl font-bold text-neutral-900-alt mb-2">{product.name}</h1>
            <p className="text-xl font-semibold text-neutral-black">{currentPrice} ₽ <span className="text-sm font-normal text-neutral-500">/ {selectedWeight} г</span></p>
            <p className="text-xs text-neutral-350 mt-1">{isOut?"Нет в наличии":`В наличии ${stock} шт.`}</p>
            <div className="border-t border-neutral-250 mt-4 pt-5">
              <h3 className="font-semibold text-neutral-black mb-3">Характеристики</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-neutral-black">Интенсивность вкуса</span>
                <span className="flex gap-1.5">{[1,2,3,4,5].map(d=>(<span key={d} className={`w-3 h-3 rounded-full ${d<=product.taste?"bg-brand-900":"bg-surface-gray-fill border border-neutral-300"}`} />))}</span>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <p className="text-neutral-500">Тип молока: <b className="text-neutral-black font-semibold">{product.milk}</b></p>
                <p className="text-neutral-500">Выдержка: <b className="text-neutral-black font-semibold">{product.age}</b></p>
                <p className="text-neutral-500">Добавки: <b className="text-neutral-black font-semibold">{product.additives}</b></p>
                <p className="text-neutral-500">Особенности: <b className="text-neutral-black font-semibold">{product.features}</b></p>
                <p className="text-neutral-500">Совместимость с вином: <b className="text-neutral-black font-semibold">{product.wine}</b></p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-semibold mb-2">Фасовка</p>
              <div className="flex gap-2.5">
                {[100,200,300].map(w=>(
                  <button key={w} type="button" onClick={()=>setSelectedWeight(w)} className={`w-20 py-2.5 rounded-radius-md text-sm font-medium border transition-colors ${w===selectedWeight?"bg-brand-900 text-surface-white border-brand-900":"bg-surface-gray-fill text-neutral-400 border-border-toggle-off hover:bg-neutral-250"}`}>{w} г</button>
                ))}
              </div>
            </div>
            {isOut && <div className="mt-4 text-sm text-neutral-500">Нет в наличии</div>}
            <button
              type="button"
              disabled={isOut}
              onClick={() => {
                const already = (items || [])
                  .filter((it) => String(it.id) === String(product.id))
                  .reduce((sum, it) => sum + it.qty, 0);

                if (timerRef.current) clearTimeout(timerRef.current);

                if (already >= stock) {
                  setBtnText(`Максимум ${stock} шт`);
                  timerRef.current = setTimeout(() => {
                    setBtnText(null);
                  }, 1200);
                  return;
                }

                add(product.id, pack, stock);
                setBtnText('✓ Добавлено');
                timerRef.current = setTimeout(() => {
                  setBtnText(null);
                }, 1200);
              }}
              className={`mt-4 w-full max-w-[320px] h-12 rounded-radius-lg font-semibold text-surface-white ${isOut?"bg-neutral-300 cursor-not-allowed":"bg-brand-900 hover:bg-brand-700"}`}
            >
              {btnText || 'В корзину'}
            </button>
            <p className="text-xs text-neutral-500 mt-2">Ближайшая доставка: завтра, {deliveryDate}</p>
          </div>
        </div>
        <div className="border-b border-neutral-250 flex gap-6 mb-6">{tabBtn('desc','О продукте')}{tabBtn('info','Состав и ценность')}{tabBtn('reviews',`Отзывы (${reviews.length})`)}</div>
        {activeTab==='desc' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-montserrat text-sm leading-6 text-neutral-black">
            <div><h4 className="font-bold mb-2">{product.name}</h4><p className="mb-4">{product.description?.text1}</p><p>{product.description?.text2}</p></div>
            <div className="bg-surface-white border border-neutral-250-a80 rounded-radius-lg p-5"><h4 className="font-bold mb-3">Гастрономические сочетания</h4><p className="mb-4">{product.description?.pairing1}</p><p>{product.description?.pairing2}</p></div>
          </div>
        )}
        {activeTab==='info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-montserrat text-sm leading-6">
            <div><h4 className="font-bold mb-2">Состав продукта</h4><p className="text-neutral-black mb-6">{product.ingredients}</p><h4 className="font-bold mb-2">Срок годности и хранение</h4><p className="text-neutral-black">{product.shelfLife}</p></div>
            <div className="bg-surface-white border border-neutral-300 rounded-radius-xl p-6"><h4 className="font-bold text-neutral-black mb-5">Пищевая ценность (на 100 г)</h4><div className="grid grid-cols-2 gap-x-10 gap-y-6">{[[product.nutrition?.calories,'ккал'],[product.nutrition?.proteins,'г белки'],[product.nutrition?.fats,'г жиры'],[product.nutrition?.carbs,'г углеводы']].map(([val,label])=>(<div key={label}><p className="font-inter text-[28px] font-bold leading-none text-brand-900">{val}</p><p className="font-inter text-xs text-neutral-500 mt-2">{label}</p></div>))}</div></div>
          </div>
        )}
        {activeTab==='reviews' && (
          <div>
            {reviews.length===0 ? (
              <div className="bg-surface-cream border border-neutral-250-a80 rounded-radius-lg py-12 text-center text-neutral-500 font-montserrat">отзывов пока нет</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
                <div className="flex flex-col gap-4">
                  {reviews.map(r=>(
                    <article key={r.id} className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 bg-surface-white border border-neutral-300 rounded-radius-lg p-6 font-montserrat">
                      <div>
                        <p className="font-bold text-neutral-black">{r.author}</p>
                        <div className="mt-3">{starsRow(r.rating)}</div>
                        {r.pairing && <p className="text-xs text-neutral-600 mt-3">Пара: {r.pairing}</p>}
                      </div>
                      <div>
                        <p className="text-sm text-neutral-black leading-6">{r.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
                <aside className="font-montserrat">
                  <p className="text-4xl font-bold text-neutral-black leading-none">{avgRating}</p>
                  <p className="text-xs text-neutral-500 mt-2">На основе {reviews.length}-х {reviewsWord(reviews.length)}</p>
                  <div className="mt-3">{starsRow(Math.floor(avgRating))}</div>
                  <button type="button" onClick={handleOpenReviewModal} className="mt-6 w-full py-3 rounded-radius-md border border-brand-outline text-brand-outline bg-surface-white text-sm font-medium hover:bg-surface-cream transition-colors">Оставить отзыв</button>
                </aside>
              </div>
            )}
          </div>
        )}
        <div className="mt-12"><h2 className="font-lora text-2xl font-bold text-neutral-900-alt mb-6">С этим сыром покупают</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{related.map(pp=>(<ProductCard key={pp.id} product={pp} />))}</div></div>
      </div>

      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-black/20 backdrop-blur-[20px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeReviewModal();
            }
          }}
        >
          <div className="relative w-full max-w-[820px] bg-surface-white rounded-[24px] shadow-2xl p-8 sm:p-12 font-montserrat">
            <h2 className="font-lora text-[24px] sm:text-[28px] font-bold text-neutral-900-alt mb-6">
              {'Оставьте отзыв о продукте'.trim()}
            </h2>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={'Напишите что думаете о данном товаре . . .'.trim()}
              className="w-full h-[150px] p-5 rounded-radius-lg border border-neutral-300 text-neutral-black placeholder:text-neutral-400 focus:outline-none focus:border-brand-900 resize-none text-[15px] leading-relaxed transition-colors"
            />

            <div className="flex gap-4 mt-6 mb-8">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  onClick={() => handlePhotoClick(idx)}
                  className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] rounded-radius-lg border border-neutral-300 flex items-center justify-center cursor-pointer overflow-hidden bg-surface-white hover:border-neutral-400 transition-colors"
                >
                  {reviewPhotos[idx] ? (
                    <img
                      src={reviewPhotos[idx]}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8 text-neutral-350"
                    >
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  )}
                  <input
                    ref={fileInputRefs[idx]}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(idx, e)}
                    className="hidden"
                  />
                </div>
              ))}
            </div>

            <h3 className="font-lora text-[20px] font-bold text-neutral-900-alt mb-4">
              {'Поставьте оценку'.trim()}
            </h3>

            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  aria-label={`Оценка ${star}`}
                  className={`w-9 h-9 rounded-full transition-colors cursor-pointer border-none p-0 ${
                    star <= reviewRating ? 'bg-brand-900' : 'bg-[#BDBDBD]'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={!reviewText.trim() || reviewRating === 0 || isSubmittingReview}
                className="px-8 py-3.5 rounded-radius-md bg-brand-900 text-surface-white text-[15px] font-medium hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
              >
                {'Оставить отзыв'.trim()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
