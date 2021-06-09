const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // Entry nos permite decir el punto de entrada de nuestra aplicación
    entry: "./src/index.js",
    // Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
    output: {
      // path es donde estará la carpeta donde se guardará los archivos
      // Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
      path: path.resolve(__dirname, "dist"),
      // filename le pone el nombre al archivo final
      filename: "[name].[contenthash].js",
      assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
      // Aqui ponemos las extensiones que tendremos en nuestro proyecto para que webpack los lea
      extensions: [".js"],
      alias: {
          '@utils': path.resolve(__dirname, 'src/utils/'),
          '@templates': path.resolve(__dirname, 'src/templates/'),
          '@styles': path.resolve(__dirname, 'src/styles/'),
          '@images': path.resolve(__dirname, 'src/assets/images/'),
      }
    },
    module: {
        //Reglas que vamos a establecer para trabajar diferentes tipos de archivos o elementos dentro del proyecto
        rules: [
            {
                //Tipo de extensiones que vamos a utilizar en el loader
                test: /\.m?js$/, //Utiliza cualquier extension que sea mjs o js

                //Yo quiero excluir los elementos js o modulos que se enceuntren dentro de node modules porque sino la aplicacion se rompe
                exclude: /node_modules/, 

                //Es una configuracion para especificar que babel utilizar
                use: {
                    loader: 'babel-loader'
                }
            },
            //Nueva regla
            {
                test: /\.(css|styl)$/i, //Lee todos los archivos css y styl
                use: [
                  MiniCssExtractPlugin.loader,
                  "css-loader",
                  "stylus-loader"
                ],
            },
            //Nueva regla (lectura de imagenes)
            {
                test: /\.png/, //Lectura de imagenes png
                type: "asset/resource"
            },

            //Nueva regla (para fonts)
            {
                test: /\.(woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000, // O LE PASAMOS UN BOOLEANOS TRUE O FALSE
                        // Habilita o deshabilita la transformación de archivos en base64.
                       mimetype: 'aplication/font-woff',
                       // Especifica el tipo MIME con el que se alineará el archivo. 
                       // Los MIME Types (Multipurpose Internet Mail Extensions)
                       // son la manera standard de mandar contenido a través de la red.
                       name: "[name].[contenthash][ext]",
                       // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
                       // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria 
                       // ubuntu-regularhola.woff
                       outputPath: './assets/fonts/', 
                       // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
                       publicPath: '../assets/fonts/',
                       // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
                      esModule: false 
                       // AVISAR EXPLICITAMENTE SI ES UN MODULO
                }
                }
            }
        ]
    },
     // SECCION DE PLUGINS
     plugins: [
        new HtmlWebpackPlugin({ // CONFIGURACIÓN DEL PLUGIN
            inject: true, // INYECTA EL BUNDLE AL TEMPLATE HTML
            template: './public/index.html', // LA RUTA AL TEMPLATE HTML
            filename: './index.html' // NOMBRE FINAL DEL ARCHIVO
        }),

        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),

        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),

        new Dotenv(),

        new CleanWebpackPlugin(),
    ],

    //Seccion de optimizacion
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), //Soporte de optimizacion para Css
            new TerserPlugin(), //Soporte de optimizacion para Js
        ]
    }
}   
  