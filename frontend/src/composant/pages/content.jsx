import React from "react";

const Content = () => {
  return (
    <div className="listBlocs">
      <div className="list">
        <h2 className="text-lg font-bold empre">Emplois récents</h2> 

        <div className="flex justify-between items-center gap-20">
        <h4 className="text-sm font-bold">Types d'Emplois</h4>
        <a href="" className="text-[#ef233c]">Tout effacer</a>
        
        </div>
        <form className="space-y-2 form1">
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option1" className="w-5 h-5" />
            <span>Option 1</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option2" className="w-5 h-5" />
            <span>Option 2</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option3" className="w-5 h-5" />
            <span>Option 3</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option5" className="w-5 h-5" />
            <span>Option 5</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option6" className="w-5 h-5" />
            <span>Option 6</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
        </form>
        

        <h4 className="text-sm font-bold pt-5">Mots clés</h4>
        <form className="space-y-2 form1">
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option1" className="w-5 h-5" />
            <span>Option 1</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option2" className="w-5 h-5" />
            <span>Option 2</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option3" className="w-5 h-5" />
            <span>Option 3</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option5" className="w-5 h-5" />
            <span>Option 5</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option6" className="w-5 h-5" />
            <span>Option 6</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" name="options" value="option4" className="w-5 h-5" />
            <span>Option 4</span>
          </label>
        </form>
        

        
      </div>

      <div className="blocs">

        <button 
          type="submit" 
          className="px-4 py-2 text-black border border-black rounded-[50px] hover:rounded-[50px] hover:bg-[#4361ee] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 but"
        >
          Voir plus
        </button>



        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 px-4 py-3 blocmm">
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
          <div class="w-64 h-48 bg-gray-300 rounded-xl"></div>
        </div>

       </div>
    </div>
  );
};

export default Content;
