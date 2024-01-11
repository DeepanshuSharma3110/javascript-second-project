

function onLoad(){


    let selectedpopularIngredients;
    let selectedItemName;
    let recipyUrl;
    const categoriesContainer = document.getElementById('categoriesContainer');
    const popularIngerdientDish = document.getElementById('popularIngerdientDish');
    const diskOptionsAvailable = document.getAnimations('diskOptionsAvailable');
    const recipyPictures = document.getElementById('recipyPictures');
    const recipyIngredients = document.getElementById('recipyIngredients');
    const recipySection = document.getElementById('recipySection');
    const recipy = document.getElementById('recipy');

    const categoriesDiv = document.getElementById('categoriesDiv');
    categoriesDiv.classList.add('item-flex-display');
    categoriesApiImport();
// search option

    const searchItem = document.getElementById('searchItem');
    const searchBox = document.getElementById('searchBox');
    const searchButton = document.getElementById('searchButton');
    let name=123;
   
    const logo = document.getElementById('logo');
    logo.addEventListener('click',()=>{
    //    popularIngerdientDish.style.display='none';
    //    recipySection.style.display='none';
    //    categoriesContainer.style.display='block';
        window.location.reload();
    })



    searchButton.addEventListener('click', ()=>{
        searchanddisplay();
        });

        searchItem.addEventListener('keydown',(event)=>{
            if(event.key==="Enter"){
                searchanddisplay();
            }
        })


     async function searchanddisplay(){
            const searchItemName = searchItem.value.replace(/ /g,"%20");
            let pic;
            let meal;
            let mealInstruction;
            
    
             if(searchItem.value != '' && name!=searchItem.value){ 
                 name = searchItem.value;
                 searchItem.value='';
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchItemName}`);
                const data = await response.json();
                 meal  = data.meals[0];
                
                    recipy.innerHTML='';
                     recipyPictures.innerHTML='';
                    recipyIngredients.innerHTML='';
         
              //  popularIngerdientDish.style.display = 'none';
              categoriesContainer.style.display='none';
              mealInstruction=meal.strInstructions;
                pic=meal.strMealThumb;
              //  recipySection.style.display='none';
                for (let i = 1; i <= 20; i++) { 
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
        
                if(ingredient && measure) {
                    recipeDisplay(ingredient, measure);
                }
            }
        
    
        console.log(`meal instruction : ${mealInstruction}, name : ${name},  pic: ${pic}  `)
             recipeInstruction(mealInstruction, pic, name);
            }
        }




//categories api import
   async function categoriesApiImport(){
        const api = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        const data = await api.json();
        data.categories.forEach(element => {
            popularIngredients(element);
        });
    }


  //import on the basis of item



   
    //categories print
    function popularIngredients(obj) {
        const singleProduct = document.createElement('div');
        singleProduct.classList.add('singleMeal');
        const thumbnail = document.createElement('img');
        thumbnail.classList.add('mealImage');

        const title = document.createElement('p');
        title.classList.add('color');
        title.classList.add('mealTitle');
        thumbnail.src = `${obj.strCategoryThumb}`;

        title.innerText = `${obj.strCategory}`;

        categoriesDiv.appendChild(singleProduct);
        singleProduct.appendChild(thumbnail);
        singleProduct.appendChild(title);

        singleProduct.addEventListener('mouseover',()=>{
            thumbnail.style.width="230px";
            title.style.color="orange";
        });

        singleProduct.addEventListener('mouseout',()=>{
            thumbnail.style.width="200px";
            title.style.color='black';
        });

        singleProduct.addEventListener('click',()=>{
            selectedpopularIngredients =`https://www.themealdb.com/api/json/v1/1/filter.php?i=${title.textContent}`
            selectedpopularIngredientsWise(selectedpopularIngredients,title.textContent);
           // console.log(selectedpopularIngredients);
        })
    }

}
//program start
onLoad();




// fetch api for dishes from the popular ingredients
async function selectedpopularIngredientsWise(selectedpopularIngredients, title){
    const response = await fetch(selectedpopularIngredients);
    const data = await response.json();

    selectedItemName = title;
    
    popularIngredientImageLoad();

    async function popularIngredientImageLoad(){
        const popularIngredientImage = document.getElementById('popularIngredientImage');
       const itemImage = document.createElement('img');
   itemImage.src=`https://www.themealdb.com/images/ingredients/${selectedItemName}.png`;
    popularIngredientImage.appendChild(itemImage);
    

    data.meals.forEach((element)=>{
        pageAccordingToPopularIngredients(element);
    });

    }
}

// creating menu of no of list presented from the selected ingredients
function pageAccordingToPopularIngredients(element){
    categoriesContainer.style.display='none';
    
    const dish = document.createElement('div');
    dish.classList.add('singleMeal');

    const dishImage = document.createElement('img');
    dishImage.src=`${element.strMealThumb}`;
    dishImage.classList.add('mealImage');
    const dishName = document.createElement('p');
    dishName.innerText=`${element.strMeal}`;
    dishName.classList.add('color');
    dishName.classList.add('mealTitle');


    diskOptionsAvailable.appendChild(dish);
    dish.appendChild(dishImage);
    dish.appendChild(dishName);



    // enents on the click and hover
    dish.addEventListener('mouseover',()=>{
        dishImage.style.width="230px";
        dishName.style.color="orange";
    });

    dish.addEventListener('mouseout',()=>{
        dishImage.style.width="200px";
        dishName.style.color='black';
    });

    dish.addEventListener('click',()=>{
       let selectedDishName= dishName.textContent;

       selectedDishName = selectedDishName.replace(/ /g, "%20");
      // console.log(selectedDishName);
       recipyUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${selectedDishName}`;
        recipe(recipyUrl,element.strMealThumb,element.strMeal);
   
    })

// reciep for the food 

    async function recipe(obj,recipyPic,name) {
        const response = await fetch(obj);
        const data = await response.json();
        const meal = data.meals[0];
        const pic = recipyPic;

        // Loop through ingredients and measures
        for (let i = 1; i <= 20; i++) { // Assuming there are 20 ingredients/measures max
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
    
            // Check if ingredient and measure exist
            if (ingredient && measure) {
                recipeDisplay(ingredient, measure);
            }
        }
        
         recipeInstruction(meal.strInstructions, pic, name)
    }
    

}


function recipeInstruction(instruction, image, name){

    const recipyPictures = document.getElementById('recipyPictures');
        recipyPictures.classList.add('item-flex-display');
    
    const recipyPicturesTag = document.createElement('img');
    const recipeName = document.createElement('h2');
    recipeName.style.color='#FFFEAF';
    recipeName.innerText = name;
    recipyPictures.prepend(recipeName);
    recipyPicturesTag.src=image;

    recipyPictures.prepend(recipyPicturesTag);

    
    const instructionTag = document.createElement('h3');
    instructionTag.innerHTML=instruction;
    instructionTag.style.color='white';

    recipy.appendChild(instructionTag);
}

function recipeDisplay(ingredient, measure) {
    popularIngerdientDish.style.display = 'none';

    const singleRecipyDiv = document.createElement('div');
    singleRecipyDiv.classList.add('item-flex-display');

    const recipyPicturesImg = document.createElement('img');
    recipyPicturesImg.alt = ingredient; 
    recipyPicturesImg.src = `https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`;

    const recipyIngredientsName = document.createElement('p');
    recipyIngredientsName.textContent = `${measure} ${ingredient}`;
 
    singleRecipyDiv.classList.add('singleMeal');
    recipyPicturesImg.classList.add('mealImage');
    

    singleRecipyDiv.appendChild(recipyPicturesImg);
    singleRecipyDiv.appendChild(recipyIngredientsName);

    recipyIngredients.appendChild(singleRecipyDiv);
    // Assuming recipyIngredients is defined elsewhere


    singleRecipyDiv.addEventListener('mouseover', () => {
        recipyPicturesImg.style.width = "230px";
        recipyIngredientsName.style.color = "orange";
    });

    singleRecipyDiv.addEventListener('mouseout', () => {
        recipyPicturesImg.style.width = "200px";
        recipyIngredientsName.style.color = 'black';
    });
}