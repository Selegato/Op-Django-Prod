from django.test import TestCase
from .services import Api_Consulta_Beneficios
import json

class TestApiConsultaBeneficios(TestCase):

    def setUp(self):
        self.api = Api_Consulta_Beneficios()
        self.cpf = '1100255460'  

    def test_consulta_beneficios_real(self):
        response = self.api.consulta_beneficios(self.cpf)
        print(response)
