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
  function removeduplicates() {
    let uniquejournalistrelatives = [];
    for (var i = 0; i <= journalistrelatives.length; i++) {
      if (i === journalistrelatives.length - 1) {
        removedubconnection(uniquejournalistrelatives); //currently running prior to last one as causes error as function is adding 1 to i
      } else if (
        journalistrelatives[i].personLabel.value ===
        journalistrelatives[i + 1].personLabel.value
      ) {
      } else {
        uniquejournalistrelatives.push(journalistrelatives[i]);
      }
    }
  }

  removeduplicates();

  //WIP in progress
  function removedubconnection(uniquejournalistrelatives) {
    console.log('unique journalist', uniquejournalistrelatives);
    let journalistrelatives = [];

    for (var i = 0; i < uniquejournalistrelatives.length; i++) {
      if (uniquejournalistrelatives[i].familyPropertyLabel.value === 'spouse') {
        // WIP. Ran out of memory. If relative connection is spouse. Check the Array being pushed to, if the spouse is already as a journalist skip
        // journalistrelatives.forEach(function (journalist) {
        //   if (
        //     uniquejournalistrelatives[i].personLabel.value ===
        //     journalist.journalistLabel.value
        //   ) {
        //     console.log(
        //       'match2. this person not added',
        //       uniquejournalistrelatives[i].journalistLabel.value
        //     );
        //   }
        // });
      } else journalistrelatives.push(uniquejournalistrelatives[i]);
    }
    console.log('journalistrelatives', journalistrelatives);
  }

  draw(journalistrelatives);
}

//put in to web map

var nodes = null;
var edges = null;
var network = null;

// Called when the Visualization API is loaded.
function draw(journalistrelatives) {
  // create people.
  // value corresponds with the age of the person
  console.log('running', journalistrelatives);
  nodes = [];

  journalistrelatives.forEach((journalist, i) =>
    nodes.push(
      {
        id: i,
        shape: 'circularImage',
        image: `${journalist.image.value}`,
        label: `${journalist.journalistLabel.value}`,
      },
      {
        id: journalistrelatives.length + i + 1,
        shape: 'circularImage',
        image: `${journalist.familyimage.value}`,
        label: `${journalist.personLabel.value}`,
      }
    )
  );

  edges = [];

  journalistrelatives.forEach((journalist, i) =>
    edges.push({ from: i, to: journalistrelatives.length + i })
  );

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
