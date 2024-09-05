# from django.test import TestCase
# from .services import API_Consulta_Vitrine_Cliente

# class TestAPI_Consulta_Vitrine_Cliente(TestCase):
#     def setUp(self):
#         self.app_id = 'your_app_id'
#         self.api = API_Consulta_Vitrine_Cliente(app_id=self.app_id)

#     def test_consulta_vitrine_cliente(self):
#         id_user_crm = '3629782a-bbe7-4043-8b91-f01af8b46524'
#         response = self.api.consulta_vitrine_cliente(id_user_crm)
#         self.assertIsNotNone(response)


# from django.test import TestCase, Client
# from django.urls import reverse

# class ConsultaVitrineViewTests(TestCase):
#     def setUp(self):
#         self.client = Client()
#         self.url = reverse('consulta_cpf_cognito')  # Substitua 'consulta_vitrine' pelo nome da URL correspondente

#     def test_consulta_vitrine_requires_login(self):
#         response = self.client.post(self.url)
#         self.assertEqual(response.status_code, 401)  # Verifica se o status é 401 Unauthorized

#     def test_consulta_vitrine_with_authentication(self):
#         # Supondo que você tenha um método para obter um token de autenticação
#         token = self.get_auth_token()
#         response = self.client.post(self.url, HTTP_AUTHORIZATION=f'Bearer {token}')
#         self.assertEqual(response.status_code, 200)  # Verifica se o status é 200 OK

#     def get_auth_token(self):
#         # Implemente a lógica para obter um token de autenticação
#         return 'seu_token_de_autenticacao