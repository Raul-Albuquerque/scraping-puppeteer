import { frontProducts } from "./front_products_list";

export const generateUrlWithProducts = ({ day }: { day: string }): string => {
  // URL base - Corrigindo a sintaxe e fechando a string corretamente
  const baseUrl = `https://app.utmify.com.br/dashboards/65ee2cf362882540c6c660ab/campanhas/?level=ad&orderBy=greater_profit&dateOption=${day}&customDateFrom=undefined&customDateTo=undefined&nameContainsAccount=&nameContainsCampaign=&nameContainsAdset=&nameContainsAd=&status=any&adAccount=all&`;

  // Filtrar os produtos que estão na lista frontProducts
  const filteredProducts = frontProducts.filter(product => {
    // Aqui você pode adicionar a lógica para filtrar os produtos
    return true; // Neste exemplo, estamos incluindo todos os produtos da lista
  });

  // Se não houver produtos, podemos retornar a URL base sem a parte de produtos
  if (filteredProducts.length === 0) {
    return baseUrl;
  }

  // Gerar a string dos produtos
  const productsParam = filteredProducts.join(',');

  // Adicionar os produtos à URL
  return `${baseUrl}products=${encodeURIComponent(productsParam)}`;
};