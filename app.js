function load(){
  try{
    state.pins=JSON.parse(localStorage.getItem('ap_pins')||'[]');
    state.schedule=JSON.parse(localStorage.getItem('ap_schedule')||'{}');
  }catch(e){}

  state.products=demo;
}
