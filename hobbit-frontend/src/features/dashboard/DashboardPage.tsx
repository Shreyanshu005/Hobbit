import { useState } from 'react';
import { Folder, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { CreateCollectionModal } from '../../components/CreateCollectionModal';
import { useCollectionStore } from '../../stores/useCollectionStore';
import learningSvg from '../../assets/learning.svg';
import card1Svg from '../../assets/card1.svg';
import logoPng from '../../assets/logo.png';

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const collections = useCollectionStore(s => s.collections);
  const deleteCollection = useCollectionStore(s => s.deleteCollection);


  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 pt-6 md:pt-10 pb-28 md:pb-14">
      <div className="flex items-center justify-between md:justify-end mb-6">
        <img src={logoPng} alt="Hobbit" className="w-20 h-14 md:hidden" />
        <div 
          className="text-3xl tracking-tight text-slate-900"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          Hobbit
        </div>
      </div>
      <section className="bg-[#f1effc] rounded-[8px] overflow-hidden">
       <div className="grid grid-cols-[3fr_2fr] md:grid-cols-[1fr_260px] gap-3 md:gap-6 p-8">
  
  <div>
    <p className="text-lg md:text-xl font-semibold text-[#b0afb3] mb-4 md:mb-6">
      A virtual assistant to
    </p>

    <h1
      className="text-4xl md:text-5xl tracking-tight text-slate-900 mb-4 md:mb-10"
      style={{ fontFamily: "'Caveat', cursive" }}
    >
      <span className="text-[#6d58e0]">Master your next</span>
      <span className="block font-semibold">hobby.</span>
    </h1>

    <Link to="/onboarding?fresh=1">
      <Button
        className="rounded-full px-4 py-2 font-bold"
        size="lg"
        style={{ backgroundColor: '#f6af40', color: '#1f2937' }}
      >
        Try Now
      </Button>
    </Link>
  </div>

  <div className="flex items-center justify-center md:justify-end">
    <img
      src={learningSvg}
      alt="Learning"
      className="w-auto max-w-[160px] md:max-w-none h-auto"
    />
  </div>

</div>
      </section>

      <section className="mt-16 md:mt-32">
        <div className="flex items-baseline gap-4 mb-20 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 shrink-0">Conversations</h2>
          <div className="h-[2px] flex-1 bg-black/10 translate-y-[-4px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10 md:mt-20 max-w-2xl">
          <div
            className="group relative bg-white border border-black/5 transition-shadow rounded-2xl h-full flex flex-col p-6 min-h-[180px]"
          >
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                <ellipse cx="46.5" cy="245" rx="159.5" ry="146" fill="#F1EFFC" className="transition-transform transform scale-0 group-hover:scale-100 duration-150 origin-bottom-left"></ellipse>
                <ellipse cx="46.5" cy="285" rx="148.5" ry="136" fill="#E2DEF9" className="transition-transform transform scale-0 group-hover:scale-100 duration-150 origin-bottom-left"></ellipse>
              </svg>
            </div>
            <div className="absolute left-[0px] top-[-50px] pointer-events-none z-30">
              <img
                src={card1Svg}
                alt="Card decoration"
                className="w-24 h-24 transition-transform duration-150 group-hover:translate-y-2 drop-shadow-sm"
              />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="h-10 mb-4" />
              <div className="text-lg text-[#1d1627] mb-4 max-w-[20rem] font-medium">
                Create custom collections to organize your hobbies, learning plans, and progress.
              </div>
              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-sm"
                >
                  Create New Collection
                </button>
              </div>
            </div>
          </div>

          {collections.map((col) => (
            <div
              key={col.id}
              className="group relative bg-white border border-black/5 transition-shadow rounded-2xl h-full flex flex-col p-6 min-h-[180px]"
            >

              <div className="h-10 mb-4 flex items-center gap-3">
                <Folder className="w-5 h-5 text-slate-600" />
                <div className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>{col.name}</div>
              </div>

              <div className="text-lg text-[#1d1627] mb-5 max-w-[20rem] font-medium">
                {col.description || 'Your custom collection'}
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-slate-400 font-medium">{col.hobbyIds.length} hobbies</span>
                <div className="flex items-center gap-2">
                  {col.id !== 'general' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (confirm(`Delete collection ${col.name}?`)) {
                          deleteCollection(col.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    to={`/collection/${col.id}`}
                    className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-sm"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section >

      <CreateCollectionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div >
  );
}
