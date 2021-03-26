// get data from wikipedia api

var journalistparents;

function getData() {
  async function getJournalistParents() {
    //URL currently people with picture, sitelinks, coutry of citizenship UK, occupation journalist, DOB after 1930
    const response = await fetch(
      `https://query.wikidata.org/sparql?query=select%20distinct%20%3Fitem%20%3FitemLabel%20%3FitemDescription%20%3FoccupationLabel%20%3FeducationLabel%20%3Fimage%20%3Fitemsitelinks%20%3Fparent%20%3FparentLabel%20%3FparentDescription%20%3FeducationParentLabel%20%3Fjournalistimage%20%3Fsitelinks%20where%20%7B%0A%20%20%20%7B%20%3Fitem%20%0A%20%20%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20wd%3AQ1930187%20%3B%20%20%20%23occupation%20journalist%20%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP27%20wd%3AQ145%20%3B%20%20%20%20%23country%20of%20citizenship%20UK%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20%3Foccupation%20%3B%20%20%23show%20occupation%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP18%20%3Fimage%20%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP569%20%3Fdate%20%3B%0A%0A%20%20%20%20%20%20%20%20%20%20wikibase%3Asitelinks%20%3Fitemsitelinks.%20%20%23%20show%20sitelinks%0A%0A%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20OPTIONAL%7B%3Fitem%20wdt%3AP69%20%3Feducation%20.%7D%20%20%20%20%20%20%20%23education%0A%20%20%09FILTER%20(%3Fdate%20%3E%20%221930-01-01T00%3A00%3A00Z%22%5E%5Exsd%3AdateTime)%0A%0A%0A%0A%20%20%0A%20%20%20%7B%20%3Fparent%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP40%20%3Fitem%20%3B%09%23parent%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20%3Fparentoccupation%20%3B%20%20%23show%20occupation%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP18%20%3Fjournalistimage%20%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wikibase%3Asitelinks%20%3Fsitelinks.%20%23%20show%20sitelinks%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20OPTIONAL%7B%3Fparent%20wdt%3AP69%20%3FeducationParent%20.%7D%20%20%20%20%20%20%20%23education%0A%0A%0A%0A%20%0A%20%20%20%20%20%20FILTER((%3Fsitelinks)%20%3E%200%20)%20.%20%20%23parents%20has%20wikipage%0A%0ASERVICE%20wikibase%3Alabel%0A%7B%20%0Abd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20.%0A%7D%20%0A%7D%0AORDER%20BY%20DESC(%3Fitemsitelinks)%0A%0A%0A`,
      {
        headers: {
          Accept: 'application/sparql-results+json',
        },
      }
    );
    const payload = await response.json();
    journalistparents = payload.results.bindings;
    draw();
  }

  getJournalistParents();

  // async function getJournalistSiblings() {
  //   //URL currently people with picture, sitelinks, coutry of citizenship UK, occupation journalist, DOB after 1930
  //   const response = await fetch(
  //     `https://query.wikidata.org/sparql?query=select%20distinct%20%3Fitem%20%3FitemLabel%20%3FitemDescription%20%3FoccupationLabel%20%3FeducationLabel%20%3Fimage%20%3Fitemsitelinks%20%3Fparent%20%3FparentLabel%20%3FparentDescription%20%3FeducationParentLabel%20%3Fjournalistimage%20%3Fsitelinks%20where%20%7B%0A%20%20%20%7B%20%3Fitem%20%0A%20%20%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20wd%3AQ1930187%20%3B%20%20%20%23occupation%20journalist%20%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP27%20wd%3AQ145%20%3B%20%20%20%20%23country%20of%20citizenship%20UK%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20%3Foccupation%20%3B%20%20%23show%20occupation%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP18%20%3Fimage%20%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP569%20%3Fdate%20%3B%0A%0A%20%20%20%20%20%20%20%20%20%20wikibase%3Asitelinks%20%3Fitemsitelinks.%20%20%23%20show%20sitelinks%0A%0A%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20OPTIONAL%7B%3Fitem%20wdt%3AP69%20%3Feducation%20.%7D%20%20%20%20%20%20%20%23education%0A%20%20%09FILTER%20(%3Fdate%20%3E%20%221930-01-01T00%3A00%3A00Z%22%5E%5Exsd%3AdateTime)%0A%0A%0A%0A%20%20%0A%20%20%20%7B%20%3Fparent%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP40%20%3Fitem%20%3B%09%23parent%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20%3Fparentoccupation%20%3B%20%20%23show%20occupation%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP18%20%3Fjournalistimage%20%3B%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20wikibase%3Asitelinks%20%3Fsitelinks.%20%23%20show%20sitelinks%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20OPTIONAL%7B%3Fparent%20wdt%3AP69%20%3FeducationParent%20.%7D%20%20%20%20%20%20%20%23education%0A%0A%0A%0A%20%0A%20%20%20%20%20%20FILTER((%3Fsitelinks)%20%3E%200%20)%20.%20%20%23parents%20has%20wikipage%0A%0ASERVICE%20wikibase%3Alabel%0A%7B%20%0Abd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20.%0A%7D%20%0A%7D%0AORDER%20BY%20DESC(%3Fitemsitelinks)%0A%0A%0A`,
  //     {
  //       headers: {
  //         Accept: 'application/sparql-results+json',
  //       },
  //     }
  //   );
  //   const payload = await response.json();
  //   journalistsiblings = payload.results.bindings;
  //   draw();
  // }

  // getJournalistSiblings();
}

getData();

//put in to web map

var nodes = null;
var edges = null;
var network = null;

// Called when the Visualization API is loaded.
function draw() {
  // create people.
  // value corresponds with the age of the person

  nodes = [];
  journalistparents.forEach((journalist, i) =>
    nodes.push(
      {
        id: i,
        shape: 'circularImage',
        image: `${journalist.image.value}`,
        label: `${journalist.itemLabel.value}`,
      },
      {
        id: journalistparents.length + i,
        shape: 'circularImage',
        image: `${journalist.journalistimage.value}`,
        label: `${journalist.parentLabel.value}`,
      }
    )
  );

  // create connections between people
  // value corresponds with the amount of contact between two people
  edges = [];
  journalistparents.forEach((journalist, i) =>
    edges.push({ from: i, to: journalistparents.length + i })
  );

  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      borderWidth: 4,
      size: 30,
      color: {
        border: '#222222',
        background: '#666666',
      },
      font: { color: '#eeeeee' },
    },
    edges: {
      color: 'lightgray',
    },
  };
  network = new vis.Network(container, data, options);
}
