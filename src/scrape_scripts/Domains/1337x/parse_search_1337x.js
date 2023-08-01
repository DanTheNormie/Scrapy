const base_item_selector_1337x = 'tbody tr'

const parse_strat_1337x = (elements)=>{

    return elements.map(e=>({
        /* type:{
            category: e.querySelector('.list-item.item-type').firstChild.innerText,
            subCategory: e.querySelector('.list-item.item-type').lastChild.innerText
        }, */
        title: e.querySelector('.coll-1.name a:nth-child(2)').innerText,
        uploadedOn: e.querySelector('.coll-date').innerText,
        xseeders: e.querySelector('.coll-2.seeds').innerText,
        leechers: e.querySelector('.coll-3.leeches').innerText,
        uploaded_by: e.querySelector('.coll-5 a').innerText,
        size: e.querySelector('.coll-4.size').innerText,
        /* magnetlink: e.querySelector('.item-icons a').getAttribute('href') */
    }))
}


module.exports = {base_item_selector_1337x, parse_strat_1337x}