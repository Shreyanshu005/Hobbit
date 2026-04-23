import { Folder } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import learningSvg from '../../assets/learning.svg';
import card1Svg from '../../assets/card1.svg';

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto pt-10 pb-14">
      <section className="rounded-[8px] bg-[#f1effc] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 p-8">
          <div>
            <p className="text-title-medium font-semibold font-title text-[#b0afb3] mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>A virtual assistant to</p>
            <h1
              className="text-4xl md:text-5xl font-normal tracking-tight text-slate-900 mb-10"
              style={{ fontFamily: "'Caveat', cursive, ui-sans-serif, system-ui" }}
            >
              <span className="text-[#6d58e0] font-normal">Master your next</span>{' '}
              <span className="text-slate-900 font-semibold">hobby.</span>
            </h1>
            <Link to="/onboarding">
              <Button
                className="rounded-full px-4 py-2"
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

      <section className="mt-32">
        <div className="flex items-baseline gap-4">
          <h2 className="text-4xl font-semibold text-slate-900 shrink-0">Conversation</h2>
          <div className="h-[2px] flex-1 bg-black/10 translate-y-[-4px]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 max-w-2xl">
          <Card
            glass={false}
            className="group relative bg-white border-black/5 shadow-md shadow-black/5 hover:shadow-sm hover:shadow-black/10 transition-shadow rounded-2xl"
          >
            <div className="absolute left-[0px] top-[-50px] pointer-events-none z-30">
              <img 
                src={card1Svg} 
                alt="Card decoration" 
                className="w-24 h-24 transition-transform duration-150 group-hover:translate-y-2 drop-shadow-sm"
              />
            </div>
            
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
              <div className="absolute left-[-20px] bottom-[-20px]">
                <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse
                    cx="20"
                    cy="180"
                    rx="220"
                    ry="180"
                    fill="#F1EFFC"
                    className="transition-transform transform scale-0 group-hover:scale-100 duration-400 origin-bottom-left"
                  />
                  <ellipse
                    cx="20"
                    cy="180"
                    rx="180"
                    ry="140"
                    fill="#E2DEF9"
                    className="transition-transform transform scale-0 group-hover:scale-100 duration-600 delay-75 origin-bottom-left"
                  />
                </svg>
              </div>
            </div>
            
            <div className="p-6 relative min-h-[180px] flex flex-col z-10">
              <div className="h-10 mb-4" /> 
              <div className="text-lg text-[#1d1627] mb-4 max-w-[20rem] font-medium">
                Create your own custom collections for events, meetings, tests etc.
              </div>
              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-sm"
                >
                  Create New Collection
                </button>
              </div>
            </div>
          </Card>

          <Card
            glass={false}
            className="group relative bg-white border-black/5 shadow-md shadow-black/5 hover:shadow-sm hover:shadow-black/10 transition-shadow rounded-2xl"
          >
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
              <div className="absolute left-[-20px] bottom-[-20px]">
                <svg width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <ellipse
                    cx="20"
                    cy="180"
                    rx="220"
                    ry="180"
                    fill="#F1EFFC"
                    className="transition-transform transform scale-0 group-hover:scale-100 duration-400 origin-bottom-left"
                  />
                  <ellipse
                    cx="20"
                    cy="180"
                    rx="180"
                    ry="140"
                    fill="#E2DEF9"
                    className="transition-transform transform scale-0 group-hover:scale-100 duration-600 delay-75 origin-bottom-left"
                  />
                </svg>
              </div>
            </div>

            <div className="p-6 relative min-h-[180px] flex flex-col z-10">
              <div className="h-10 mb-4 flex items-center gap-3">
                <Folder className="w-5 h-5 text-slate-600" />
                <div className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>General Collection</div>
              </div>

              <div className="text-lg text-[#1d1627] mb-5 max-w-[20rem] font-medium">
                Now save all relevant conversations in a single collection.
              </div>

              <div className="mt-auto flex justify-end">
                <button
                  type="button"
                  className="px-6 py-2 rounded-full text-sm font-semibold text-indigo-700 border border-indigo-200 bg-white transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 shadow-sm"
                >
                  View
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
