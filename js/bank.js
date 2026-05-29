const Bank={
 data: JSON.parse(localStorage.getItem("bankData")) || [],
 submit(){
  const item={name:document.getElementById("bank-name").value,amount:Number(document.getElementById("bank-amount").value),date:document.getElementById("bank-date").value,note:document.getElementById("bank-note").value};
  this.data.push(item);
  localStorage.setItem("bankData",JSON.stringify(this.data));
  this.render();
  closeModal("bank-modal");
 },
 render(){
  const tbody=document.getElementById("bank-tbody");
  if(!this.data.length){tbody.innerHTML='<tr><td colspan="4">စာရင်း မရှိသေးပါ</td></tr>';return;}
  let total=0;
  tbody.innerHTML=this.data.map(i=>{total+=i.amount;return `<tr><td>${i.name}</td><td>${i.amount.toLocaleString()} ကျပ်</td><td>${i.date}</td><td>${i.note}</td></tr>`}).join('');
  document.getElementById("bank-total").innerText=total.toLocaleString()+" ကျပ်";
 }
};
window.addEventListener("load",()=>Bank.render());