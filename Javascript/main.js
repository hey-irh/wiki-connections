//Get Data from wikipedia

async function getJournalistRelatives() {
  //URL currently people with picture, sitelinks, coutry of citizenship UK, occupation journalist, DOB after 1930
  try {
    const response = await fetch(
      `https://query.wikidata.org/sparql?query=select%20distinct%20%3FjournalistLabel%20%3FjournalistImage%20%3FfamilyPropertyLabel%20%3FpersonLabel%20%3Frelativeimage%0Awhere%20%7B%0A%20%20%0A%20%20%20%20%7B%3FfamilyProperty%20wdt%3AP1647*%20wd%3AP1038%20%3B%20%7D%0A%20%20%7B%3FfamilyProperty%20wikibase%3AdirectClaim%20%3FfamilyClaim%20%3B%7D%0A%20%20%0A%20%20%20%7B%20%3Fjournalist%20%0A%20%20%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP106%20wd%3AQ1930187%20%3B%20%20%20%23occupation%20journalist%20%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP27%20wd%3AQ145%20%3B%20%20%20%20%23country%20of%20citizenship%20UK%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP18%20%3FjournalistImage%20%3B%0A%20%20%20%20%20%20%20%20%20%20wdt%3AP569%20%3Fdate%20.%7D%0A%20%20%09FILTER%20(%3Fdate%20%3E%20%221930-01-01T00%3A00%3A00Z%22%5E%5Exsd%3AdateTime)%0A%20%20%0A%20%20%20%20%20%7B%3Fperson%20wikibase%3Asitelinks%20%3Fsitelinks%20.%20%7D%0A%20%20%20%20OPTIONAL%20%7B%20%3Fperson%20wdt%3AP18%20%20%3Frelativeimage%20.%20%7D%0A%20%20%0A%20%20%3Fjournalist%20%3FfamilyClaim%20%3Fperson%20.%0A%20%20%23%20request%20labels%0A%20%20%3Fperson%20rdfs%3Alabel%20%3FpersonLabel%20.%0A%20%20FILTER((LANG(%3FpersonLabel))%20%3D%20%22en%22%20%20%26%26%20((%3Fsitelinks)%20%3E%200%20)%20).%0A%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22%20%7D%0A%0A%7D%0AORDER%20BY%20%3FjournalistLabel`,
      {
        headers: {
          Accept: 'application/sparql-results+json',
        },
      }
    );
    const payload = await response.json();
    let journalistrelatives = payload.results.bindings;
    cleanData(journalistrelatives);
  } catch (err) {
    console.log('error: ', err);
  }
}

getJournalistRelatives();

//Clean data

function cleanData(journalistrelatives) {
  function removedubs() {
    let uniquejournalist = journalistrelatives.filter(
      (thing, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.personLabel.value === thing.personLabel.value &&
            t.journalistLabel.value === thing.journalistLabel.value
        )
    );

    removespouse(uniquejournalist);
  }
  removedubs();

  function removespouse(uniquejournalist) {
    let cleanData = [];

    uniquejournalist.forEach(function (j) {
      if (j.familyPropertyLabel.value === 'spouse') {
        // WIP local stprage issue currently
        // cleanData.forEach(function (e) {
        //   if (e.journalistLabel.value === j.personLabel.value) {
        //   } else cleanData.push(j);
        // });
      } else cleanData.push(j);
    });

    addImages(cleanData);
  }

  function addImages(cleanData) {
    for (let i = 0; i < cleanData.length; i++) {
      if (cleanData[i] === 'undefined') continue;
      cleanData[i].relativeimage = {
        value:
          '/Users/isabel/Desktop/Coding/PersonalProjects/wiki-connections/OutlinePerson.png',
      };
    }
    draw(cleanData);
  }
}

//put in to web map

nodes = null;
var edges = null;
var network = null;

// Called when the Visualization API is loaded.
function draw(journalistrelatives) {
  nodes = [];

  journalistrelatives.forEach(function (journalist) {
    nodes.some(function (data) {
      console.log(data.journalistLabel.value, journalist.journalistLabel.value);
      if (data.journalistLabel.value === journalist.journalistLabel.value) {
        nodes.push({
          id: journalistrelatives.length,
          shape: 'circularImage',
          image: `${journalist.familyimage.value}`,
          brokenImage:
            '/Users/isabel/Desktop/Coding/PersonalProjects/wiki-connections/OutlinePerson.png',
          label: `${journalist.personLabel.value}`,
        });
      } else
        nodes.push(
          {
            id: i,
            shape: 'circularImage',
            image: `${journalist.image.value}`,
            brokenImage:
              '/Users/isabel/Desktop/Coding/PersonalProjects/wiki-connections/OutlinePerson.png',
            label: `${journalist.journalistLabel.value}`,
          },
          {
            id: journalistrelatives.length,
            shape: 'circularImage',
            image: `${journalist.familyimage.value}`,
            brokenImage:
              '/Users/isabel/Desktop/Coding/PersonalProjects/wiki-connections/OutlinePerson.png',
            label: `${journalist.personLabel.value}`,
          }
        );
    });
  });
}

//   edges = [];

//   journalistrelatives.forEach((journalist, i) =>
//     edges.push({ from: i, to: journalistrelatives.length + i })
//   );

//   var container = document.getElementById('mynetwork');
//   var data = {
//     nodes: nodes,
//     edges: edges,
//   };
//   var options = {
//     nodes: {
//       borderWidth: 4,
//       size: 30,
//       color: {
//         border: '#222222',
//         background: '#666666',
//       },
//       font: { color: '#eeeeee' },
//     },
//     edges: {
//       color: 'lightgray',
//     },
//   };
//   network = new vis.Network(container, data, options);
// }
