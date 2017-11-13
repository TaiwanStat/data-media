function initAbout(){
  $('.about-icon').on('click', function(){
    const fbIcon = '<a class="fa fa-facebook-square" aria-hidden="true" href="//fb.me/minedia.info"></i>'
    $('#modal-container').addClass('show');
    $('#pop-content .card-container').addClass('show');
    $('#pop-content .card-container .list').empty();
    $('#pop-content .about-container').html(`<h1>為什麼要做這個專案？</h1>
<h3>我們相信用心去感動，用數據說故事，這個社會會變得更好。</h3>
<p>那我們要說什麼故事呢？我們要說的是一個關於新聞媒體的故事。</p>
<p>不知道大家有沒有曾經遇過這個問題，面對市面上百家爭鳴的媒體，像是蘋果日報、自由時報、東森新聞雲、中國時報、報導者、端傳媒、風傳媒.....，你不知道要看哪個媒體作為你的資訊來源，又或者是通通追蹤了，但是你的臉書卻永遠滑不到底。
</p>
<p>在這個社群媒體的時代，新舊媒體百家爭鳴，資訊爆炸，只要創立一個粉絲專頁，甚至就可以成為一個媒體，自己貼文、報導。
新聞媒體為了生存，各自朝向了迥異的方向發展，有些開始朝向大量話題新聞，有些則專注於深入報導，有些則好腥羶色，那你又該如何選擇呢？
</p>
<p>在這個專案中，我們打算做一個媒體閱聽人的燈塔，打開媒體的黑盒子， 視覺化媒體的品牌獨特性，將隨著時間加入更多媒體的資料，願大家能在這裡找到自己的媒礦。</p>
${fbIcon}
`)
  })
}