import Prelude hiding ((+),(*),(==))
import qualified Prelude as P

import DSL

main = putStrLn (show (d(1 + 2 + 'x') "x" 3))