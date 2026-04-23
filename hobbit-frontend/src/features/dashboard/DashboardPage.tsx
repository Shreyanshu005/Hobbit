import { useState } from 'react';
import { Folder, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { CreateCollectionModal } from '../../components/CreateCollectionModal';
import { useCollectionStore } from '../../stores/useCollectionStore';
import learningSvg from '../../assets/learning.svg';
import card1Svg from '../../assets/card1.svg';

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const collections = useCollectionStore(s => s.collections);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 pt-6 md:pt-10 pb-12 md:pb-14">
      <div className="flex items-center justify-end mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-black/5 text-base font-semibold text-slate-700">
          <CalendarDays className="w-4 h-4 text-[#00bdff]" />
          <span className="text-slate-700">{today}</span>
        </div>
      </div>
      <section className="rounded-[8px] bg-[#f1effc] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 p-8">
          <div>
            <p className="text-title-medium font-semibold font-title text-[#b0afb3] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>A virtual assistant to</p>
            <h1
              className="text-3xl md:text-5xl font-normal tracking-tight text-slate-900 mb-6 md:mb-10"
              style={{ fontFamily: "'Caveat', cursive, ui-sans-serif, system-ui" }}
            >
              <span className="text-[#6d58e0] font-normal">Master your next</span>{' '}
              <span className="text-slate-900 font-semibold">hobby.</span>
            </h1>
            <Link to="/onboarding?fresh=1">
              <Button
                className="rounded-full px-4 py-2 "
                size="lg"
                style={{ backgroundColor: '#f6af40', color: '#1f2937' }}
              >
                Try Now
              </Button>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-end">
            <img
              src={learningSvg}
              alt="Learning"
              className="h-[210px] w-auto"
            />
          </div>
        </div>
      </section>

      <section className="mt-16 md:mt-32">
        <div className="flex items-baseline gap-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 shrink-0">Collections</h2>
          <div className="h-[2px] flex-1 bg-black/10 translate-y-[-4px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-10 md:mt-20 max-w-2xl">
          <div
            className="group relative bg-white border border-black/5 shadow-md shadow-black/5 hover:shadow-sm hover:shadow-black/10 transition-shadow rounded-2xl h-full flex flex-col p-6 min-h-[180px]"
          >
            <div className="absolute left-[0px] top-[-50px] pointer-events-none z-30">
              <img
                src={card1Svg}
                alt="Card decoration"
                className="w-24 h-24 transition-transform duration-150 group-hover:translate-y-2 drop-shadow-sm"
              />
            </div>

            <div className="h-10 mb-4" />
            <div className="text-lg text-[#1d1627] mb-4 max-w-[20rem] font-medium">
              Create your own custom collections for events, meetings, tests etc.
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

          {collections.map((col) => (
            <div
              key={col.id}
              className="group relative bg-white border border-black/5 shadow-md shadow-black/5 hover:shadow-sm hover:shadow-black/10 transition-shadow rounded-2xl h-full flex flex-col p-6 min-h-[180px]"
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
                <Link
                  to={`/collection/${col.id}`}
                  className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-sm"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section >

      <CreateCollectionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div >
  );
}
