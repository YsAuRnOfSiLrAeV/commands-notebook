import './App.css'
import { AddSectionForm, SectionList, Sidebar } from './components';

function App() {

  return (
    <>
      <div className="flex flex-row w-full h-screen overflow-hidden items-start justify-between gap-10">
        <div className="flex flex-col w-3/4 h-full overflow-auto [direction:rtl] pt-10 scrollbar-dark [scrollbar-gutter:stable]">
          <div className="[direction:ltr]">
            <AddSectionForm />
            <SectionList />
          </div>
        </div>
        <div className="w-1/4 h-full p-4 overflow-auto bg-[#1f2329] border-l border-gray-800 grid place-items-center">
          <Sidebar />
        </div>
      </div>
    </>
  )
}

export default App
