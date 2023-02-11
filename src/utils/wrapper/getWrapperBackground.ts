import getUser from "../getUser";

const imagePathArray = [
  [`1624359209425-05eb9b809795`, `1136`],
  [`1660982238213-eeef93d9dc16`, `1374`],
  [`1660721858715-54a4ec915458`, `1374`],
  [`1658660856337-1d09e19424ae`, `1374`],
  [`1657741146771-0bd2bcdf7a1b`, `1374`],
  [`1630873292791-66937fdabdb8`, `1374`],
  [`1633810272517-29775182963c`, `1374`],
  [`1619359059287-9d024d7081ef`, `1374`],
  [`1650473395449-5ad9037cc318`, `3000`],
  [`1659469377768-4f42f2f091c5`, `1374`],
  [`1511207538754-e8555f2bc187`, `1227`],
  [`1610917689031-0cfdc44036ba`, `1374`],
  [`1635614017406-7c192d832072`, `1374`],
  [`1550025899-5f8a06b1b3a8`, `1374`],
];

function getRandomPath() {
  return imagePathArray[Math.floor(Math.random() * imagePathArray.length)];
}

function formatLink(path: string[]) {
  return `
    https://images.unsplash.com/photo-${
      path[0]
    }?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=${
      path[1]
    }&q=80
  `;
}

export default function getWrapperBackground() {
  const user = getUser();

  if (!user) {
    return formatLink(imagePathArray[0]);
  }
  
  const sessionStorageItem = sessionStorage.getItem('wrapperBackground');
  if (sessionStorageItem) {
    return formatLink(JSON.parse(sessionStorageItem));
  } else {
    const path = getRandomPath();
    sessionStorage.setItem('wrapperBackground', JSON.stringify(path));
    return formatLink(path);
  }
}