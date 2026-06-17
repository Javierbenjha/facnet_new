// Estructura: Departamento → Provincia → Distritos[]
export const UBIGEO: Record<string, Record<string, string[]>> = {
  'Amazonas': {
    'Chachapoyas': ['Chachapoyas', 'Asunción', 'Balsas', 'Cheto', 'Leimebamba', 'Magdalena', 'Soloco', 'Sonche'],
    'Bagua':       ['Bagua', 'El Cenepa', 'Imaza', 'La Peca', 'Río Santiago'],
    'Utcubamba':   ['Bagua Grande', 'Cajaruro', 'Cumba', 'El Milagro', 'Lonya Grande', 'Yamón'],
  },

  'Áncash': {
    'Huaraz':  ['Huaraz', 'Independencia', 'Jangas', 'La Libertad', 'Olleros', 'Pampas', 'Paria', 'Tarica'],
    'Santa':   ['Chimbote', 'Cáceres del Perú', 'Coishco', 'Macate', 'Moro', 'Nepeña', 'Nuevo Chimbote', 'Samanco', 'Santa'],
    'Casma':   ['Casma', 'Buena Vista Alta', 'Comandante Noel', 'Yaután'],
    'Huarmey': ['Huarmey', 'Cochapetí', 'Culebras', 'Huayan', 'Malvas'],
  },

  'Apurímac': {
    'Abancay':     ['Abancay', 'Chacoche', 'Circa', 'Curahuasi', 'Huanipaca', 'Lambrama', 'Pichirhua', 'Tamburco'],
    'Andahuaylas': ['Andahuaylas', 'Andarapa', 'Huancarama', 'Huancaray', 'Kishuara', 'Pacucha', 'San Jerónimo', 'Talavera', 'Turpo'],
    'Cotabambas':  ['Tambobamba', 'Cotabambas', 'Coyllurqui', 'Haquira', 'Mara', 'Challhuahuacho'],
  },

  'Arequipa': {
    'Arequipa':  ['Arequipa', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado', 'Characato', 'Jacobo Hunter', 'José Luis Bustamante y Rivero', 'La Joya', 'Mariano Melgar', 'Miraflores', 'Paucarpata', 'Sachaca', 'Socabaya', 'Tiabaya', 'Uchumayo', 'Yanahuara'],
    'Camaná':    ['Camaná', 'José María Quimper', 'Mariscal Cáceres', 'Nicolás de Piérola', 'Ocoña', 'Quilca', 'Samuel Pastor'],
    'Caylloma':  ['Chivay', 'Achoma', 'Cabanaconde', 'Callalli', 'Coporaque', 'Huambo', 'Ichupampa', 'Lari', 'Lluta', 'Maca', 'Madrigal', 'Tapay', 'Tuti', 'Yanque'],
    'Islay':     ['Mollendo', 'Cocachacra', 'Dean Valdivia', 'El Fiscal', 'Islay', 'Mejía', 'Punta de Bombón'],
  },

  'Ayacucho': {
    'Huamanga': ['Ayacucho', 'Acocro', 'Acoria', 'Carmen Alto', 'Chiara', 'Jesús Nazareno', 'Pacaycasa', 'Quinua', 'San Juan Bautista', 'Santiago de Pischa', 'Socos', 'Tambillo', 'Vinchos'],
    'Huanta':   ['Huanta', 'Ayahuanco', 'Huamanguilla', 'Iguain', 'Llochegua', 'Luricocha', 'Santillana', 'Sivia'],
    'La Mar':   ['San Miguel', 'Anco', 'Ayna', 'Chilcas', 'Chungui', 'Luis Carranza', 'Santa Rosa', 'Tambo', 'Samugari'],
  },

  'Cajamarca': {
    'Cajamarca': ['Cajamarca', 'Asunción', 'Chetilla', 'Cospan', 'Encanada', 'Jesús', 'Llacanora', 'Los Baños del Inca', 'Magdalena', 'Matara', 'Namora', 'San Juan'],
    'Jaén':      ['Jaén', 'Bellavista', 'Chontali', 'Colasay', 'Huabal', 'Pucará', 'San Felipe', 'Santa Rosa'],
    'Chota':     ['Chota', 'Anguia', 'Cochabamba', 'Conchan', 'Huambos', 'Lajas', 'Llama', 'Miracosta', 'Querocoto', 'Tocmoche'],
    'Celendín':  ['Celendín', 'Chumuch', 'Cortegana', 'Huasmin', 'Oxamarca', 'Sorochuco', 'Sucre', 'Utco'],
  },

  'Callao': {
    'Callao': ['Callao', 'Bellavista', 'Carmen de La Legua Reynoso', 'La Perla', 'La Punta', 'Mi Perú', 'Ventanilla'],
  },

  'Cusco': {
    'Cusco':         ['Cusco', 'Ccorca', 'Poroy', 'San Jerónimo', 'San Sebastián', 'Santiago', 'Saylla', 'Wanchaq'],
    'La Convención': ['Santa Ana', 'Echarate', 'Huayopata', 'Maranura', 'Pichari', 'Kimbiri', 'Vilcabamba'],
    'Urubamba':      ['Urubamba', 'Chinchero', 'Huayllabamba', 'Machupicchu', 'Maras', 'Ollantaytambo', 'Yucay'],
    'Quispicanchis': ['Urcos', 'Andahuaylillas', 'Cusipata', 'Huaro', 'Lucre', 'Marcapata', 'Ocongate', 'Oropesa'],
    'Canchis':       ['Sicuani', 'Checacupe', 'Combapata', 'Maranganí', 'Pitumarca', 'San Pablo', 'San Pedro', 'Tinta'],
  },

  'Huancavelica': {
    'Huancavelica': ['Huancavelica', 'Acobambilla', 'Acoria', 'Conayca', 'Cuenca', 'Huayllahuara', 'Izcuchaca', 'Manta', 'Moya', 'Palca', 'Vilca', 'Yauli'],
    'Tayacaja':     ['Pampas', 'Acostambo', 'Acraquia', 'Ahuaycha', 'Colcabamba', 'Daniel Hernández', 'Huaribamba', 'Pazos', 'Salcabamba', 'Surcubamba'],
    'Angaraes':     ['Lircay', 'Anchonga', 'Callanmarca', 'Ccochaccasa', 'Chincho', 'Congalla', 'Julcamarca', 'San Antonio de Antaparco'],
  },

  'Huánuco': {
    'Huánuco':       ['Huánuco', 'Amarilis', 'Chinchao', 'Churubamba', 'Pillco Marca', 'Quisqui', 'Santa María del Valle', 'Yarumayo'],
    'Leoncio Prado': ['Rupa-Rupa', 'Daniel Alomia Robles', 'Hermilio Valdizan', 'José Crespo y Castillo', 'Luyando', 'Mariano Dámaso Beraún'],
    'Dos de Mayo':   ['La Unión', 'Chuquis', 'Marias', 'Pachas', 'Quivilla', 'Ripan', 'Shunqui', 'Sillapata', 'Yanas'],
  },

  'Ica': {
    'Ica':     ['Ica', 'La Tinguiña', 'Los Aquijes', 'Ocucaje', 'Parcona', 'Pueblo Nuevo', 'Salas', 'San Juan Bautista', 'Santiago', 'Subtanjalla', 'Tate'],
    'Pisco':   ['Pisco', 'Huancano', 'Humay', 'Independencia', 'Paracas', 'San Andrés', 'San Clemente', 'Túpac Amaru Inca'],
    'Chincha': ['Chincha Alta', 'Alto Larán', 'El Carmen', 'Grocio Prado', 'Pueblo Nuevo', 'Sunampe', 'Tambo de Mora'],
    'Nasca':   ['Nasca', 'Changuillo', 'El Ingenio', 'Marcona', 'Vista Alegre'],
  },

  'Junín': {
    'Huancayo':    ['Huancayo', 'Carhuacallanga', 'Chilca', 'Chongos Alto', 'El Tambo', 'Hualhuas', 'Huancan', 'Pilcomayo', 'Pucará', 'San Agustín de Cajas', 'San Jerónimo de Tunán', 'Saño', 'Sapallanga', 'Sicaya'],
    'Chanchamayo': ['Chanchamayo', 'Perené', 'Pichanaqui', 'San Ramón', 'Vitoc'],
    'Tarma':       ['Tarma', 'Acobamba', 'Huasahuasi', 'La Unión', 'Palca', 'Palcamayo', 'San Pedro de Cajas', 'Tapo'],
    'Jauja':       ['Jauja', 'Acolla', 'Apata', 'Ataura', 'Canchayllo', 'Curicaca', 'Marco', 'Molinos', 'Muquiyauyo', 'Paca', 'Pomacancha', 'Sincos', 'Yauli', 'Yauyos'],
    'Satipo':      ['Satipo', 'Coviriali', 'Llaylla', 'Mazamari', 'Pampa Hermosa', 'Pangoa', 'Río Negro', 'Río Tambo', 'Vizcatán del Ene'],
  },

  'La Libertad': {
    'Trujillo':   ['Trujillo', 'El Porvenir', 'Florencia de Mora', 'Huanchaco', 'La Esperanza', 'Laredo', 'Moche', 'Poroto', 'Salaverry', 'Simbal', 'Víctor Larco Herrera'],
    'Ascope':     ['Ascope', 'Casa Grande', 'Chicama', 'Chocope', 'Magdalena de Cao', 'Paiján', 'Rázuri', 'Santiago de Cao'],
    'Pacasmayo':  ['Pacasmayo', 'Guadalupe', 'Jequetepeque', 'Pueblo Nuevo', 'San Pedro de Lloc'],
    'Sánchez Carrión': ['Huamachuco', 'Chugay', 'Cochorco', 'Curgos', 'Huamachuco', 'Marcabal', 'Sanagorán', 'Sarín', 'Sartimbamba'],
  },

  'Lambayeque': {
    'Chiclayo':   ['Chiclayo', 'Cayaltí', 'Chongoyape', 'Eten', 'José Leonardo Ortiz', 'La Victoria', 'Monsefú', 'Oyotún', 'Pimentel', 'Pomalca', 'Pucalá', 'Reque', 'Santa Rosa', 'Zaña'],
    'Lambayeque': ['Lambayeque', 'Chóchope', 'Íllimo', 'Jayanca', 'Mochumí', 'Mórrope', 'Motupe', 'Olmos', 'Pacora', 'Salas', 'San José', 'Túcume'],
    'Ferreñafe':  ['Ferreñafe', 'Cañaris', 'Incahuasi', 'Pitipo', 'Pueblo Nuevo'],
  },

  'Lima': {
    'Lima': [
      'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Cercado de Lima', 'Chorrillos', 'Cieneguilla', 'Comas',
      'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lince', 'Los Olivos',
      'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacámac', 'Pucusana', 'Pueblo Libre',
      'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac', 'San Bartolo', 'San Borja', 'San Isidro',
      'San Juan de Lurigancho', 'San Juan de Miraflores', 'San Luis', 'San Martín de Porres', 'San Miguel',
      'Santa Anita', 'Santa María del Mar', 'Santa Rosa', 'Santiago de Surco', 'Surquillo',
      'Villa El Salvador', 'Villa María del Triunfo',
    ],
    'Barranca':    ['Barranca', 'Paramonga', 'Pativilca', 'Supe', 'Supe Puerto'],
    'Cañete':      ['San Vicente de Cañete', 'Asia', 'Calango', 'Cerro Azul', 'Chilca', 'Coayllo', 'Imperial', 'Lunahuaná', 'Mala', 'Nuevo Imperial', 'Quilmaná', 'San Antonio', 'San Luis', 'Santa Cruz de Flores', 'Zúñiga'],
    'Huaral':      ['Huaral', 'Aucallama', 'Chancay', 'Ihuarí', 'Lampian', 'Pacaraos', 'San Miguel de Acos', 'Santa Cruz de Andamarca', 'Sumbilca', 'Veintisiete de Noviembre'],
    'Huaura':      ['Huacho', 'Ambar', 'Carquín', 'Checras', 'Hualmay', 'Huaura', 'Leoncio Prado', 'Paccho', 'Santa Leonor', 'Santa María', 'Sayán', 'Vegueta'],
    'Canta':       ['Canta', 'Arahuay', 'Huamantanga', 'Huaros', 'Lachaqui', 'San Buenaventura', 'Santa Rosa de Quives'],
    'Huarochirí':  ['Matucana', 'Antioquía', 'Callahuanca', 'Carampoma', 'Chicla', 'Cuenca', 'Huachupampa', 'Huanza', 'Huarochirí', 'Lahuaytambo', 'Langa', 'Lapla', 'Laraos', 'Mariatana', 'Ricardo Palma', 'San Andrés de Tupicocha', 'San Antonio', 'San Damián', 'San Juan de Iris', 'San Juan de Tantaranche', 'San Lorenzo de Quinti', 'San Mateo', 'San Mateo de Otao', 'San Pedro de Casta', 'San Pedro de Huancayre', 'Sangallaya', 'Santa Cruz de Cocachacra', 'Santa Eulalia', 'Santiago de Anchucaya', 'Santiago de Tuna', 'Santo Domingo de Los Olleros', 'Surco'],
  },

  'Loreto': {
    'Maynas':         ['Iquitos', 'Alto Nanay', 'Fernando Lores', 'Indiana', 'Las Amazonas', 'Mazán', 'Napo', 'Punchana', 'Torres Causana'],
    'Alto Amazonas':  ['Yurimaguas', 'Balsapuerto', 'Barranca', 'Jeberos', 'Lagunas', 'Santa Cruz', 'Teniente César López Rojas'],
    'Requena':        ['Requena', 'Alto Tapiche', 'Capelo', 'Emilio San Martín', 'Maquia', 'Puinahua', 'Saquena', 'Soplin', 'Tapiche', 'Jenaro Herrera', 'Yaquerana'],
    'Ucayali':        ['Contamana', 'Inahuaya', 'Padre Márquez', 'Pampa Hermosa', 'Sarayacu', 'Vargas Guerra'],
  },

  'Madre de Dios': {
    'Tambopata': ['Tambopata', 'Inambari', 'Las Piedras', 'Laberinto'],
    'Manu':      ['Manu', 'Fitzcarrald', 'Madre de Dios', 'Huepetuhe'],
    'Tahuamanu': ['Iñapari', 'Iberia', 'Tahuamanu'],
  },

  'Moquegua': {
    'Mariscal Nieto':      ['Moquegua', 'Carumas', 'Cuchumbaya', 'Samegua', 'San Cristóbal', 'Torata'],
    'Ilo':                 ['Ilo', 'El Algarrobal', 'Pacocha'],
    'General Sánchez Cerro': ['Omate', 'Chojata', 'Coalaque', 'Ichuña', 'La Capilla', 'Lloque', 'Matalaque', 'Puquina', 'Quinistaquillas', 'Ubinas', 'Yunga'],
  },

  'Pasco': {
    'Pasco':     ['Chaupimarca', 'Huachón', 'Huariaca', 'Huayllay', 'Ninacaca', 'Pallanchacra', 'Paucartambo', 'San Francisco de Asís de Yarusyacán', 'Santa Ana de Tusi', 'Simón Bolívar', 'Ticlacayan', 'Tinyahuarco', 'Vicco', 'Yanacancha'],
    'Oxapampa':  ['Oxapampa', 'Chontabamba', 'Huancabamba', 'Palcazu', 'Pozuzo', 'Puerto Bermúdez', 'Villa Rica'],
    'Daniel Alcides Carrión': ['Yanahuanca', 'Chacayán', 'Goyllarisquizga', 'Paucar', 'San Pedro de Pillao', 'Santa Ana de Tusi', 'Tapuc', 'Vilcabamba'],
  },

  'Piura': {
    'Piura':    ['Piura', 'Castilla', 'Catacaos', 'Cura Morí', 'La Arena', 'La Unión', 'Las Lomas', 'Tambogrande', 'Veintiséis de Octubre'],
    'Sullana':  ['Sullana', 'Bellavista', 'Ignacio Escudero', 'Lancones', 'Marcavelica', 'Miguel Checa', 'Querecotillo', 'Salitral'],
    'Talara':   ['Pariñas', 'El Alto', 'La Brea', 'Lobitos', 'Los Órganos', 'Máncora'],
    'Paita':    ['Paita', 'Amotape', 'Arenal', 'Colán', 'La Huaca', 'Tamarindo', 'Vichayal'],
    'Piura (Sechura)': ['Sechura', 'Bellavista de La Unión', 'Bernal', 'Cristo Nos Valga', 'Rinconada Llícuar', 'Vice'],
    'Ayabaca':  ['Ayabaca', 'Frias', 'Jililí', 'Lagunas', 'Montero', 'Pacaipampa', 'Paimas', 'Sapillica', 'Sicchez', 'Suyo'],
  },

  'Puno': {
    'Puno':       ['Puno', 'Acora', 'Amantani', 'Atuncolla', 'Capachica', 'Chucuito', 'Coata', 'Huata', 'Mañazo', 'Paucarcolla', 'Pichacani', 'Platería', 'San Antonio', 'Tiquillaca', 'Vilque'],
    'San Román':  ['Juliaca', 'Cabana', 'Cabanillas', 'Caracoto', 'San Miguel'],
    'El Collao':  ['Ilave', 'Capazo', 'Pilcuyo', 'Santa Rosa', 'Conduriri'],
    'Azángaro':   ['Azángaro', 'Achaya', 'Arapa', 'Asillo', 'Caminaca', 'Chupa', 'José Domingo Choquehuanca', 'Muñani', 'Potoni', 'Saman', 'San Antón', 'San José', 'San Juan de Salinas', 'Santiago de Pupuja', 'Tirapata'],
    'Carabaya':   ['Macusani', 'Ajoyani', 'Ayapata', 'Coasa', 'Corani', 'Crucero', 'Ituata', 'Ollachea', 'San Gabán', 'Usicayos'],
  },

  'San Martín': {
    'San Martín': ['Tarapoto', 'Alberto Leveau', 'Cacatachi', 'Chazuta', 'Chipurana', 'El Porvenir', 'Huimbayoc', 'Juan Guerra', 'La Banda de Shilcayo', 'Morales', 'Papaplaya', 'San Antonio', 'Sauce', 'Shapaja'],
    'Moyobamba': ['Moyobamba', 'Calzada', 'Habana', 'Jepelacio', 'Soritor', 'Yantaló'],
    'Rioja':     ['Rioja', 'Awajún', 'Elías Soplín Vargas', 'Nueva Cajamarca', 'Pardo Miguel', 'Posic', 'San Fernando', 'Yorongos', 'Yuracyacu'],
    'Lamas':     ['Lamas', 'Alonso de Alvarado', 'Barranquita', 'Caynarachi', 'Cuñumbuqui', 'Pinto Recodo', 'Rumisapa', 'San Roque de Cumbaza', 'Shanao', 'Tabalosos', 'Zapatero'],
    'Tocache':   ['Tocache', 'Nuevo Progreso', 'Pólvora', 'Shunte', 'Uchiza'],
  },

  'Tacna': {
    'Tacna':        ['Tacna', 'Alto de la Alianza', 'Calana', 'Ciudad Nueva', 'Inclán', 'Palca', 'Pachía', 'Pocollay', 'Sama', 'Coronel Gregorio Albarracín Lanchipa'],
    'Tarata':       ['Tarata', 'Estique', 'Estique-Pampa', 'Héroes Albarracín', 'Sitajara', 'Susapaya', 'Tarucachi', 'Ticaco'],
    'Candarave':    ['Candarave', 'Cairani', 'Camilaca', 'Curibaya', 'Huanuara', 'Quilahuani'],
    'Jorge Basadre': ['Locumba', 'Ilabaya', 'Ite'],
  },

  'Tumbes': {
    'Tumbes':                   ['Tumbes', 'Corrales', 'La Cruz', 'Pampas de Hospital', 'San Jacinto', 'San Juan de la Virgen'],
    'Zarumilla':                ['Zarumilla', 'Aguas Verdes', 'Matapalo', 'Papayal'],
    'Contralmirante Villar':    ['Zorritos', 'Casitas', 'Canoas de Punta Sal'],
  },

  'Ucayali': {
    'Coronel Portillo': ['Callería', 'Campoverde', 'Iparía', 'Masisea', 'Manantay', 'Nueva Requena', 'Yarinacocha'],
    'Padre Abad':       ['Padre Abad', 'Irazola', 'Curimaná', 'Neshuya', 'Alexander von Humboldt'],
    'Atalaya':          ['Raymondi', 'Sepahua', 'Tahuania', 'Yurúa'],
    'Purús':            ['Purús'],
  },
};

export const DEPARTAMENTOS = Object.keys(UBIGEO).sort();

export function getProvincias(dep: string): string[] {
  return Object.keys(UBIGEO[dep] ?? {});
}

export function getDistritos(dep: string, prov: string): string[] {
  return UBIGEO[dep]?.[prov] ?? [];
}
